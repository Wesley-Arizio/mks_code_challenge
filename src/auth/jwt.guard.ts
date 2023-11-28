import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { constants } from '../constants';

@Injectable()
export class JwtGuard extends AuthGuard(constants.JWT_STRATEGY) {}
