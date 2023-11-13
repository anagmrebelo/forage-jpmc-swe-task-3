export interface Order {
  price: number;
  size: number;
}
export interface ServerRespond {
  stock: string;
  top_bid: Order;
  top_ask: Order;
  timestamp: Date;
}

export interface Thresholds {
  up_threshold: number;
  low_threshold: number;
}

class DataStreamer {
  static API_URL: string = "http://localhost:8080/query?id=1";

  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open("GET", DataStreamer.API_URL, false);

    request.onload = () => {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      } else {
        alert("Request failed");
      }
    };

    request.send();
  }
}

class ThresholdStreamer {
  static API_URL: string = "http://localhost:8080/thresholds";

  static getData(callback: (data: Thresholds) => void): void {
    const request = new XMLHttpRequest();
    request.open("GET", ThresholdStreamer.API_URL, false);

    request.onload = () => {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      } else {
        alert("Request failed");
      }
    };

    request.send();
  }
}

export { DataStreamer, ThresholdStreamer };
