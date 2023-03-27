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
      console.log(query.date, "NNNNNNNNNNNNNN");
      // const date = this.dateService.getTimelessDateInUTCTimeZone(query.date);

      const getLogsDTO = {
        logbookId: logbook.id,
        date: query.date,
      };

      const logs = await this.getLogs.execute(getLogsDTO);

      const logsResponseDTO = logs.map((log) => ({
        id: log.id,
        logbookId: log.logbookId,
        userId: log.userId,
        visibility: log.visibility,
        date: log.date,
        message: log.message,
        durationOfWorkInMinutes: log.durationOfWorkInMinutes,
        ...(log.proofOfWork && {
          proofOfWork: {
            id: log?.proofOfWork?.id,
            name: log?.proofOfWork?.name,
            logId: log?.proofOfWork?.logId,
            type: log?.proofOfWork?.type,
            url: log?.proofOfWork?.url,
          },
        }),
      }));

      res.status(200).json(logsResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
