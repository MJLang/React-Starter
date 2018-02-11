import { ProdConfig } from 'app/common/config/prod';
import { initapp } from 'app/core/app';

initapp(new ProdConfig());
