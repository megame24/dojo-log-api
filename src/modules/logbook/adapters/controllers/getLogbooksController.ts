import Adapter from "../../../shared/adapters/adapter";
import { GetLogbooks } from "../../useCases/getLogbooks";

export default class GetLogbooksController extends Adapter {
  constructor(private getLogbooks: GetLogbooks) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const getLogbooksDTO = {
        userId: req.query.userId,
        user: req.user,
      };

      const logbooks = await this.getLogbooks.execute(getLogbooksDTO);

      const logbooksResponseDTO = logbooks.map((logbook) => ({
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        visibility: logbook.visibility,
        description: logbook.description,
        category: {
          id: logbook.category?.id,
          name: logbook.category?.name,
        },
      }));

      res.status(200).json(logbooksResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
