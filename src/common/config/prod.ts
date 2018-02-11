import { Config } from './config';
import { BuildType } from 'app/common/models/build-type';

/**
 * Configuration overrides for the development environment.
 */
export class ProdConfig extends Config {
  public buildType = BuildType.Dev;
  apiURL = process.env.REACT_APP_API_URL || '';
}
