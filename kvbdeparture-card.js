import {
  LitElement,
  html,
  property,
  customElement,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class KVBDepartureCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      departures: { type: Array },
      stationname: { type: String },
      threshold: { type: Number}
    };
  }

  constructor() {
    // Always call super() first
    super();
    this.stationname = "Unknown";
    this.departures = [];
    this.threshold = 2;
  }




  set hass(val) {
    const oldValueHass = this._hass;
    this._hass = val;

    const entityId = this.config.entity;
    const state = this.hass.states[entityId];

    const oldValDep = this.departures;
    this.departures = state.attributes["departures"];

    const oldValStationname = this.stationname;
    this.stationname = state.attributes["stationname"];
    this.requestUpdate("hass", oldValueHass);
    this.requestUpdate("departures", oldValDep);
    this.requestUpdate("stationname", oldValStationname);
  }

  get hass() {
    return this._hass;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    if(config.threshold) {
      this.threshold = config.threshold;
    }
    this.config = config;
  }
  getCardSize() {
    return this.departures.length + 1;
  }

  render() {
    return html`
      <ha-card header="${this.stationname}">
        <table class="departure">
          <tr>
            <th>Line</th>
            <th>Direction</th>
            <th>Departure</th>
            <th></th>
          </tr>
          ${this.departures.map(
            (item) =>
              html` <tr>
                <td>${item.line_id}</td>
                <td>${item.direction}</td>
                <td>${item.wait_time} Min</td>
                <td><ha-icon icon="${item.wait_time <= this.threshold ? `mdi:tram-side` : `mdi:tram`}"></ha-icon></td>
              </tr>`
          )}
        </table>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      .departure { 
        padding: 5px;
        text-align: left;
        }
      .departure tr { width: 100%; }
      .departure td:first-child { width: 80px; }
      .departure th:first-child { width: 80px; }
      .departure td:nth-last-child(2){ width: 80px; text-align: right;}
      .departure th:nth-last-child(2) { width: 80px; text-align: right;}
      .departure td:last-child{ width: 25px; text-align: right;}
      .departure th:last-child{ width: 25px; text-align: right;}
      .departure td { width: 200px; }
      .departure th { width: 200px; }
    `;
  }
}
customElements.define("kvbdeparture-card", KVBDepartureCard);
