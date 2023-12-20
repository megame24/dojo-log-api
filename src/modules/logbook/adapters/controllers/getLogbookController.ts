import Adapter from "../../../shared/adapters/adapter";
import { GetLogbook } from "../../useCases/getLogbook";

export default class GetLogbookController extends Adapter {
  constructor(private getLogbook: GetLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { startDateString, endDateString, year } = req.query;

    const startDate = startDateString;
    const endDate = endDateString;

    const getLogbookDTO = {
      logbookId: req.params.logbookId,
      startDate,
      endDate,
      year,
    };

    try {
      const logbook = await this.getLogbook.execute(getLogbookDTO);

      const logbookResponseDTO = {
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        description: logbook.description,
        visibility: logbook.visibility,
        heatmap: logbook.heatmap,
        yearHeatmapDisplay: logbook.yearHeatmapDisplay,
        ...(logbook.category && {
          category: {
            id: logbook.category.id,
            name: logbook.category.name,
            iconName: logbook.category.iconName,
            color: logbook.category.color,
          },
        }),
      };

      res.status(200).json(logbookResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
