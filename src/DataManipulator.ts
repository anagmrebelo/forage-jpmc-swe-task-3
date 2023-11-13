import { ServerRespond, ThresholdStreamer, Thresholds } from "./Streamers";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number | undefined;
  timestamp: Date;
  trigger_alert: number | undefined;
  up_threshold: number;
  low_threshold: number;
}

function calculatePrice(serverResponds: ServerRespond): number {
  const bid_price = serverResponds["top_bid"]["price"];
  const ask_price = serverResponds["top_ask"]["price"];
  const price = (bid_price + ask_price) / 2;

  return price;
}

function calculateRatio(price_a: number, price_b: number): number | undefined {
  if (price_b == 0) return undefined;
  return price_a / price_b;
}

function getMaxDate(date_a: Date, date_b: Date): Date {
  return date_a > date_b ? date_a : date_b;
}

export class DataManipulator {
  static generateRow(
    serverResponds: ServerRespond[],
    thresholds: Thresholds
  ): Row {
    const price_abc = calculatePrice(serverResponds[0]);
    const price_def = calculatePrice(serverResponds[1]);
    const ratio = calculateRatio(price_abc, price_def);
    const timestamp = getMaxDate(
      serverResponds[0].timestamp,
      serverResponds[1].timestamp
    );
    let up_threshold = thresholds.up_threshold;
    let low_threshold = thresholds.low_threshold;

    const trigger_alert =
      ratio && (ratio > up_threshold || ratio < low_threshold)
        ? ratio
        : undefined;

    return {
      price_abc: price_abc,
      price_def: price_def,
      ratio: ratio,
      timestamp: timestamp,
      trigger_alert: trigger_alert,
      up_threshold: up_threshold,
      low_threshold: low_threshold,
    };
  }
}
