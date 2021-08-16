export const mockNext = jest.fn();

export const mockRes = {
  status: jest.fn().mockReturnValue({
    json: jest.fn(),
  }),
};

export const mockUUUIDv4 = jest.fn();
