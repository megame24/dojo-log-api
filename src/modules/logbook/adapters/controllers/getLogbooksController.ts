import Adapter from "../../../shared/adapters/adapter";
import { GetLogbooks } from "../../useCases/getLogbooks";

export default class GetLogbooksController extends Adapter {
  constructor(private getLogbooks: GetLogbooks) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { userId, startDateString, endDateString } = req.query;

      const startDate = startDateString;
      const endDate = endDateString;

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
        heatmap: logbook.heatmap,
        ...(logbook.category && {
          category: {
            id: logbook.category.id,
            name: logbook.category.name,
            iconName: logbook.category.iconName,
            color: logbook.category.color,
          },
        }),
      }));

      res.status(200).json(logbooksResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
