import Adapter from "../../../shared/adapters/adapter";
import { GetLogbook } from "../../useCases/getLogbook";

export default class GetLogbookController extends Adapter {
  constructor(private getLogbook: GetLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const getLogbookDTO = {
      logbookId: req.params.logbookId,
      year: req.query.year,
    };

    try {
      const logbook = await this.getLogbook.execute(getLogbookDTO);

      const logbookResponseDTO = {
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        description: logbook.description,
        category: {
          id: logbook.category.id,
          name: logbook.category.name,
        },
        heatmap: logbook.heatMap,
      };
      res.status(200).json({ logbookResponseDTO });
    } catch (error) {
      next(error);
    }
  }
}
