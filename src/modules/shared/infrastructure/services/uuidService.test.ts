import { mockUUUIDv4 } from "../../testUtils";
import { UUIDServiceImpl } from "./uuidService";

describe("UUID service test", () => {
  it("Should call the external uuid package injected when generate is called", () => {
    new UUIDServiceImpl(mockUUUIDv4).generate();

    expect(mockUUUIDv4).toHaveBeenCalled();
  });
});
