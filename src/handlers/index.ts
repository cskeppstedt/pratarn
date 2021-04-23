import weeb from './weeb';
import carlsucks from './carlsucks';
import dank from './dank';
import help from './help';
import memes from './memes';
import mymlan from './mymlan';
import prata from './prata';
import ree from './ree';

const handlers = [dank, memes, weeb, prata, carlsucks, mymlan, ree];

export default [...handlers, help(handlers)];
