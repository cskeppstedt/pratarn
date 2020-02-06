import carlsucks from './carlsucks';
import dank from './dank';
import help from './help';
import mymlan from './mymlan';
import prata from './prata';

const handlers = [dank, prata, carlsucks, mymlan];

export default [...handlers, help(handlers)];
