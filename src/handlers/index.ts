import weeb from './weeb';
import carlsucks from './carlsucks';
import dank from './dank';
import help from './help';
import memes from './memes';
import mymlan from './mymlan';
import prata from './prata';

const handlers = [dank, memes, weeb, prata, carlsucks, mymlan];

export default [...handlers, help(handlers)];
