// note: only parse the publisher version and URL since that's all we care about
export interface IGToolingInfo {
  publisher: IGToolVersionInfo;
}
export interface IGToolVersionInfo {
  version: string;
  link: string;
}
