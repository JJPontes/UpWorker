import { authenticateToken } from '../../middlewares/authenticateToken';

describe('authenticateToken middleware', () => {
  it('permite acesso com token válido', () => {
    const req = { headers: { authorization: 'Bearer validtoken' } } as any;
    const res = { sendStatus: jest.fn(), status: jest.fn(), json: jest.fn() } as any;
    const next = jest.fn();
    jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation((token, secret, cb: any) => (cb as Function)(null, { userId: 1 }));
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('bloqueia acesso sem token', () => {
    const req = { headers: {} } as any;
    const res = { sendStatus: jest.fn(), status: jest.fn(), json: jest.fn() } as any;
    const next = jest.fn();
    authenticateToken(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
