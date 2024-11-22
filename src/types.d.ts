export interface FormData{
    firstName: string;
    lastName: string;
    email: string;
    user: string;
    psw: string;
}

export interface Movie {
    adult:             boolean;
    backdrop_path:     string;
    genre_ids:         number[];
    id:                number;
    original_language: OriginalLanguage;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    release_date:      Date;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

export enum OriginalLanguage {
    En = "en",
    Es = "es",
    Fr = "fr",
}

export interface Genres {
    id:   number;
    name: string;
}


export interface APIResults {
    results: User[];
    info:    Info;
}

export interface Info {
    seed:    string;
    results: number;
    page:    number;
    version: string;
}

export interface User {
    gender:     string;
    name:       Name;
    location:   Location;
    email:      string;
    login:      Login;
    dob:        Dob;
    registered: Dob;
    phone:      string;
    cell:       string;
    id:         ID;
    picture:    Picture;
    nat:        string;
}

export interface Dob {
    date: Date;
    age:  number;
}

export interface ID {
    name:  string;
    value: null | string;
}

export interface Location {
    street:      Street;
    city:        string;
    state:       string;
    country:     string;
    postcode:    number;
    coordinates: Coordinates;
    timezone:    Timezone;
}

export interface Coordinates {
    latitude:  string;
    longitude: string;
}

export interface Street {
    number: number;
    name:   string;
}

export interface Timezone {
    offset:      string;
    description: string;
}

export interface Login {
    uuid:     string;
    username: string;
    password: string;
    salt:     string;
    md5:      string;
    sha1:     string;
    sha256:   string;
}

export interface Name {
    title: string;
    first: string;
    last:  string;
}

export interface Picture {
    large:     string;
    medium:    string;
    thumbnail: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAPIResults(json: string): APIResults {
        return cast(JSON.parse(json), r("APIResults"));
    }

    public static aPIResultsToJson(value: APIResults): string {
        return JSON.stringify(uncast(value, r("APIResults")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "APIResults": o([
        { json: "results", js: "results", typ: a(r("Result")) },
        { json: "info", js: "info", typ: r("Info") },
    ], false),
    "Info": o([
        { json: "seed", js: "seed", typ: "" },
        { json: "results", js: "results", typ: 0 },
        { json: "page", js: "page", typ: 0 },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Result": o([
        { json: "gender", js: "gender", typ: "" },
        { json: "name", js: "name", typ: r("Name") },
        { json: "location", js: "location", typ: r("Location") },
        { json: "email", js: "email", typ: "" },
        { json: "login", js: "login", typ: r("Login") },
        { json: "dob", js: "dob", typ: r("Dob") },
        { json: "registered", js: "registered", typ: r("Dob") },
        { json: "phone", js: "phone", typ: "" },
        { json: "cell", js: "cell", typ: "" },
        { json: "id", js: "id", typ: r("ID") },
        { json: "picture", js: "picture", typ: r("Picture") },
        { json: "nat", js: "nat", typ: "" },
    ], false),
    "Dob": o([
        { json: "date", js: "date", typ: Date },
        { json: "age", js: "age", typ: 0 },
    ], false),
    "ID": o([
        { json: "name", js: "name", typ: "" },
        { json: "value", js: "value", typ: u(null, "") },
    ], false),
    "Location": o([
        { json: "street", js: "street", typ: r("Street") },
        { json: "city", js: "city", typ: "" },
        { json: "state", js: "state", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "postcode", js: "postcode", typ: 0 },
        { json: "coordinates", js: "coordinates", typ: r("Coordinates") },
        { json: "timezone", js: "timezone", typ: r("Timezone") },
    ], false),
    "Coordinates": o([
        { json: "latitude", js: "latitude", typ: "" },
        { json: "longitude", js: "longitude", typ: "" },
    ], false),
    "Street": o([
        { json: "number", js: "number", typ: 0 },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Timezone": o([
        { json: "offset", js: "offset", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Login": o([
        { json: "uuid", js: "uuid", typ: "" },
        { json: "username", js: "username", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "salt", js: "salt", typ: "" },
        { json: "md5", js: "md5", typ: "" },
        { json: "sha1", js: "sha1", typ: "" },
        { json: "sha256", js: "sha256", typ: "" },
    ], false),
    "Name": o([
        { json: "title", js: "title", typ: "" },
        { json: "first", js: "first", typ: "" },
        { json: "last", js: "last", typ: "" },
    ], false),
    "Picture": o([
        { json: "large", js: "large", typ: "" },
        { json: "medium", js: "medium", typ: "" },
        { json: "thumbnail", js: "thumbnail", typ: "" },
    ], false),
};


/*WEATHER */

export interface WeatherError {
    error: Error;
}

export interface Error {
    code:    number;
    message: string;
}
export interface WeatherResults {
    location: Location;
    current:  Current;
    forecast: Forecast;
}

export interface Current {
    last_updated_epoch?: number;
    last_updated?:       string;
    temp_c:              number;
    temp_f:              number;
    is_day:              number;
    condition:           Condition;
    wind_mph:            number;
    wind_kph:            number;
    wind_degree:         number;
    wind_dir:            WindDir;
    pressure_mb:         number;
    pressure_in:         number;
    precip_mm:           number;
    precip_in:           number;
    humidity:            number;
    cloud:               number;
    feelslike_c:         number;
    feelslike_f:         number;
    windchill_c:         number;
    windchill_f:         number;
    heatindex_c:         number;
    heatindex_f:         number;
    dewpoint_c:          number;
    dewpoint_f:          number;
    vis_km:              number;
    vis_miles:           number;
    uv:                  number;
    gust_mph:            number;
    gust_kph:            number;
    time_epoch?:         number;
    time?:               string;
    snow_cm?:            number;
    will_it_rain?:       number;
    chance_of_rain?:     number;
    will_it_snow?:       number;
    chance_of_snow?:     number;
}

export interface Condition {
    text: Text;
    icon: Icon;
    code: number;
}

export enum Icon {
    CDNWeatherapiCOMWeather64X64Day113PNG = "//cdn.weatherapi.com/weather/64x64/day/113.png",
    CDNWeatherapiCOMWeather64X64Day116PNG = "//cdn.weatherapi.com/weather/64x64/day/116.png",
    CDNWeatherapiCOMWeather64X64Day119PNG = "//cdn.weatherapi.com/weather/64x64/day/119.png",
    CDNWeatherapiCOMWeather64X64Day143PNG = "//cdn.weatherapi.com/weather/64x64/day/143.png",
    CDNWeatherapiCOMWeather64X64Day176PNG = "//cdn.weatherapi.com/weather/64x64/day/176.png",
    CDNWeatherapiCOMWeather64X64Day248PNG = "//cdn.weatherapi.com/weather/64x64/day/248.png",
    CDNWeatherapiCOMWeather64X64Night113PNG = "//cdn.weatherapi.com/weather/64x64/night/113.png",
    CDNWeatherapiCOMWeather64X64Night116PNG = "//cdn.weatherapi.com/weather/64x64/night/116.png",
    CDNWeatherapiCOMWeather64X64Night119PNG = "//cdn.weatherapi.com/weather/64x64/night/119.png",
    CDNWeatherapiCOMWeather64X64Night176PNG = "//cdn.weatherapi.com/weather/64x64/night/176.png",
    CDNWeatherapiCOMWeather64X64Night353PNG = "//cdn.weatherapi.com/weather/64x64/night/353.png",
}

export enum Text {
    Clear = "Clear ",
    Cloudy = "Cloudy ",
    Fog = "Fog",
    LightRainShower = "Light rain shower",
    Mist = "Mist",
    PartlyCloudy = "Partly Cloudy ",
    PatchyRainNearby = "Patchy rain nearby",
    Sunny = "Sunny",
}

export enum WindDir {
    E = "E",
    Ene = "ENE",
    Ese = "ESE",
    N = "N",
    Ne = "NE",
    Nne = "NNE",
    S = "S",
    SE = "SE",
    SSE = "SSE",
    Ssw = "SSW",
    Sw = "SW",
    Wsw = "WSW",
}

export interface Forecast {
    forecastday: Forecastday[];
}

export interface Forecastday {
    date:       Date;
    date_epoch: number;
    day:        Day;
    astro:      Astro;
    hour:       Current[];
}

export interface Astro {
    sunrise:           string;
    sunset:            string;
    moonrise:          string;
    moonset:           string;
    moon_phase:        string;
    moon_illumination: number;
    is_moon_up:        number;
    is_sun_up:         number;
}

export interface Day {
    maxtemp_c:            number;
    maxtemp_f:            number;
    mintemp_c:            number;
    mintemp_f:            number;
    avgtemp_c:            number;
    avgtemp_f:            number;
    maxwind_mph:          number;
    maxwind_kph:          number;
    totalprecip_mm:       number;
    totalprecip_in:       number;
    totalsnow_cm:         number;
    avgvis_km:            number;
    avgvis_miles:         number;
    avghumidity:          number;
    daily_will_it_rain:   number;
    daily_chance_of_rain: number;
    daily_will_it_snow:   number;
    daily_chance_of_snow: number;
    condition:            Condition;
    uv:                   number;
}

export interface Location {
    name:            string;
    region:          string;
    country:         string;
    lat:             number;
    lon:             number;
    tz_id:           string;
    localtime_epoch: number;
    localtime:       string;
}