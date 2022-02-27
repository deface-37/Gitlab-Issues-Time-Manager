import { LocationLike, QueryStringUtils, StringMap } from "@openid/appauth";

export class WindowsQueryStringUtils implements QueryStringUtils {
  stringify(input: StringMap): string {
    return (new URLSearchParams(input)).toString();
  }
  parse(query: LocationLike, useHash?: boolean): StringMap {
    return this.parseQueryString(query.search)
  }
  parseQueryString(query: string): StringMap {
    const params = new URLSearchParams(query);

    return Object.fromEntries( params.entries())
  }

}