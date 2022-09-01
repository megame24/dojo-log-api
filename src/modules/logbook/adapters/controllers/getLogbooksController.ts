import Adapter from "../../../shared/adapters/adapter";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { GetLogbooks } from "../../useCases/getLogbooks";

export default class GetLogbooksController extends Adapter {
  constructor(
    private getLogbooks: GetLogbooks,
    private dateService: DateService
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { userId, startDateString, endDateString } = req.query;

      let startDate: Date;
      let endDate: Date;

      if (!startDateString || !endDateString) {
        startDate = this.dateService.getStartOfCurrentWeek();
        endDate = this.dateService.getEndOfCurrentWeek();
        console.log(startDate, endDate);
      } else {
        startDate = this.dateService.getTimelessDate(startDateString);
        endDate = this.dateService.getTimelessDate(endDateString);
      }

      const getLogbooksDTO = {
        userId,
        user: req.user,
        startDate,
        endDate,
      };

      const logbooks = await this.getLogbooks.execute(getLogbooksDTO);

      const logbooksResponseDTO = logbooks.map((logbook) => ({
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        visibility: logbook.visibility,
        description: logbook.description,
        heatmap: logbook.heatMap,
        ...(logbook.category && {
          category: {
            id: logbook.category.id,
            name: logbook.category.name,
          },
        }),
      }));

      res.status(200).json(logbooksResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
