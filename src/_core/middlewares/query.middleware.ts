import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FindAndCountOptions, Op } from 'sequelize';

/**
 * Middleware to handle query parameters before they reach the controller _find_ method
 * for _Section_ and _Book_ models.
 */
@Injectable()
export class QueryMiddleware implements NestMiddleware {
  /**
   * Handles incoming requests and processes query parameters to build options for the controller.
   * Attaches the options object to the request for use in the controller.
   *
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction to pass control to the next middleware/controller.
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Get model name from URL
    const modelName = req.originalUrl.split('/')[1].split('?')[0];
    // Extract query parameters from req.query and build options object
    const search = req.query.search;
    let offset = +req.query.offset || 0;
    const limit = +req.query.limit || 10;
    const page = +req.query.page;
    if (!!page) offset = limit * (page - 1);
    const rawOrder = req.query.order || '';

    // Build the conditions based on model name and search keyword
    const where = this._buildCondition(modelName, search);

    // Order query
    const order = this._buildOrder(modelName, rawOrder);

    const options: Omit<FindAndCountOptions<any>, 'group'> = {
      where,
      // Other options as needed
      offset,
      limit,
      order,
    };

    // Attach the options object to the request for use in the controller
    req['queryOptions'] = options;

    next();
  }

  /**
   * Builds the conditions for the query based on the model name and search keyword.
   *
   * @param modelName - The name of the model (e.g., 'sections', 'books').
   * @param search - The search keyword provided in the query parameters.
   * @returns The conditions object for the query.
   */
  private _buildCondition(modelName, search) {
    let where = {};

    if (search) {
      switch (modelName) {
        case 'sections':
          where = {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                description: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          };
          break;
        case 'books':
          where = {
            [Op.or]: [
              {
                title: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                author: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              {
                summary: {
                  [Op.iLike]: `%${search}%`,
                },
              },
            ],
          };
          break;
        default:
          where = {};
          break;
      }
    }

    return where;
  }

  /**
   * Builds the order configuration for the query based on the model name and raw order string.
   *
   * @param modelName - The name of the model (e.g., 'sections', 'books').
   * @param rawOrder - The raw order string provided in the query parameters.
   * @returns The order configuration for the query.
   */
  private _buildOrder(modelName, rawOrder) {
    let order = [];
    let attributes = ['id', 'createdAt', 'updatedAt'];
    const sectionsAttributes = ['name', 'description'];
    const booksAttributes = ['title', 'author', 'date', 'summary', 'copies'];
    attributes =
      modelName === 'sections'
        ? [...sectionsAttributes, ...attributes]
        : [...booksAttributes, ...attributes];
    if (!!rawOrder) {
      order = rawOrder.split(',').map((row) => {
        const items = row.split(':');
        return attributes.includes(items[0])
          ? [items[0], items[1]]
          : ['createdAt', 'desc'];
      });
    }
    return order;
  }
}
