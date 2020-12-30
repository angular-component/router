import { UrlParser } from './url-parser';

describe('UrlParser', () => {
  let parser: UrlParser;

  beforeEach(() => {
    parser = new UrlParser();
  });

  describe('joinUrls', () => {
    it('should join two urls', () => {
      expect(parser.joinUrls('path1/path2', 'path3/path4')).toEqual(
        'path1/path2/path3/path4'
      );
    });
    it('should strip off original query params', () => {
      expect(
        parser.joinUrls('path1/path2?param1=value1', 'path3/path4')
      ).toEqual('path1/path2/path3/path4');
    });
    it('should leave query params on target url', () => {
      expect(
        parser.joinUrls('path1/path2', 'path3/path4?param1=value1')
      ).toEqual('path1/path2/path3/path4?param1=value1');
    });
    it('should ignore cwd on segment', () => {
      expect(
        parser.joinUrls('path1/path2', './path3/path4?param1=value1')
      ).toEqual('path1/path2/path3/path4?param1=value1');
    });
    it('should apply ".." to go back through segments', () => {
      expect(
        parser.joinUrls('path1/path2', '../../path3/path4?param1=value1')
      ).toEqual('path3/path4?param1=value1');
    });
  });
});
