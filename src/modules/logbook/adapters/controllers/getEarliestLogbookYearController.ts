import Adapter from "../../../shared/adapters/adapter";
import { GetEarliestLogbookYear } from "../../useCases/getEarliestLogbookYear";

export default class GetEarliestLogbookYearController extends Adapter {
  constructor(private getEarliestLogbookYear: GetEarliestLogbookYear) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const year = await this.getEarliestLogbookYear.execute();

      res.status(200).json(year);
    } catch (error) {
      next(error);
    }
  }
}
