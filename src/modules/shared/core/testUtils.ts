export const next = jest.fn();
export const res = {
  status: jest.fn().mockReturnValue({
    json: jest.fn(),
  }),
};
