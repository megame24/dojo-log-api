import Adapter from "../../../shared/adapters/adapter";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { GetLogs } from "../../useCases/getLogs";

export default class GetLogsController extends Adapter {
  constructor(private getLogs: GetLogs, private dateService: DateService) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { query, logbook } = req;
      const date = this.dateService.getTimelessDate(query.date);

      const getLogsDTO = {
        logbookId: logbook.id,
        date,
      };

      const logs = await this.getLogs.execute(getLogsDTO);

      const logsResponseDTO = logs.map((log) => ({
        id: log.id,
        logbookId: log.logbookId,
        userId: log.userId,
        visibility: log.visibility,
        date: log.date,
        message: log.message,
        durationOfWork: log.durationOfWork,
        proofOfWorkImageUrl: log.proofOfWorkImageUrl,
      }));

      res.status(200).json(logsResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
