import { makeAutoObservable, runInAction } from "mobx";

// constants
import { EMPTY_STORE_DATA } from "../constants/constants";

// types
import type { CoinsData } from "../constants/types";

class CoinsDataStore {
	coinsData: CoinsData;

	constructor() {
		this.coinsData = EMPTY_STORE_DATA;
		makeAutoObservable(this);
	}

	clearStore = (): void => {
		this.coinsData = EMPTY_STORE_DATA;
	};

	setCoinsData = (data: CoinsData): void => {
		runInAction(() => {
			this.coinsData = data;
		});
	};
}

export default new CoinsDataStore();
