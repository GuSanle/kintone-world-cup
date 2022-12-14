import {
  GetLeftScore,
  GetChipInList,
  GetMatchList,
} from "@/services/kintoneApi";
import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      myScore: 0,
      chipInList: [],
    };
  },

  getters: {
    chipListShow(state) {
      return state.chipInList.map((record) => {
        // record.scoreChange = record.Score_result;
        // const teamWinMaping = {"Awin":}
        if (record.Score_result == 0) {
          record.scoreWin = "--";
          record.teamInfo.Score = "--";
          record.type = "chip in";
        } else if (record.Score_result < 0) {
          record.scoreWin = `--`;
          record.type = "loss";
        } else {
          record.scoreWin = `+ ${record.Score_result}`;
          record.type = "win";
        }
        return record;
      });
    },
  },

  actions: {
    async init() {
      const initLeftScorePromise = this.getLeftScore();
      const initChipInListPromise = this.getChipInList();
      return Promise.all([initLeftScorePromise, initChipInListPromise]);
    },

    async getLeftScore() {
      this.myScore = await GetLeftScore();
    },

    async getChipInList() {
      const chipInList = await GetChipInList();
      const matches = await GetMatchList();
      const matchMapping = {};
      for (const item of matches) {
        matchMapping[item.Match_id] = {
          FlagA: item.FlagA,
          FlagB: item.FlagB,
          TeamA_name: item.TeamA_name,
          TeamB_name: item.TeamB_name,
          Score: `${item.ScoreA}:${item.ScoreB}`,
        };
      }
      chipInList.map((chip) => {
        chip.teamInfo = matchMapping[chip.Match_id];
        return chip;
      });
      this.chipInList = chipInList;
    },
  },
});
