import Adapter from "../../../shared/adapters/adapter";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { GetLogbook } from "../../useCases/getLogbook";

export default class GetLogbookController extends Adapter {
  constructor(
    private getLogbook: GetLogbook,
    private dateService: DateService
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { startDateString, endDateString } = req.query;

    let startDate: Date;
    let endDate: Date;

    if (!startDateString || !endDateString) {
      startDate = this.dateService.getStartOfCurrentYear();
      endDate = this.dateService.getEndOfCurrentYear();
    } else {
      startDate = this.dateService.getTimelessDate(startDateString);
      endDate = this.dateService.getTimelessDate(endDateString);
    }

    const getLogbookDTO = {
      logbookId: req.params.logbookId,
      startDate,
      endDate,
    };

    try {
      const logbook = await this.getLogbook.execute(getLogbookDTO);

      const logbookResponseDTO = {
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        description: logbook.description,
        visibility: logbook.visibility,
        heatmap: logbook.heatMap,
        ...(logbook.category && {
          category: {
            id: logbook.category.id,
            name: logbook.category.name,
          },
        }),
      };

      res.status(200).json(logbookResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
