import { ActionTree, MutationTree, GetterTree, Action, ActionContext } from 'vuex';
import { RootState } from 'store';

export const name = 'serviceworker';

export const types = {
    UPDATE_ARCHIVE: 'UPDATE_ARCHIVE',
    UPDATE_SERVICEWORKER: 'UPDATE_SERVICEWORKER',
    UPDATE_ERROR: 'UPDATE_ERROR'
};

export interface State {
    archive: string | null;
    serviceworker: number | null;
    error: string | null;
}

export const state = (): State => ({
    archive: null,
    serviceworker: null,
    error: null
});

export const getters: GetterTree<State, RootState> = {};

export interface Actions<S, R> extends ActionTree<S, R> {
    downloadServiceWorker(context: ActionContext<S, R>, serviceWorkerId: number): void;
}

export const actions: Actions<State, RootState> = {

    async downloadServiceWorker({ commit }, serviceworker: number): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            if (!serviceworker) {
                commit(types.UPDATE_ERROR, 'Serviceworker is not defined');
                resolve();
            }

            commit(types.UPDATE_SERVICEWORKER, serviceworker);

            try {
                const apiUrl = `${process.env.apiUrl}/serviceworkers?ids=${serviceworker}`;
                const result = await this.$axios.$get(apiUrl);
                commit(types.UPDATE_ARCHIVE, result.archive);
                resolve();
            } catch (e) {
                commit(types.UPDATE_ERROR, e.response.data.error || e.response.data || e.response.statusText);
            }
        });
    }
};

export const mutations: MutationTree<State> = {
    [types.UPDATE_ARCHIVE](state, archive: string): void {
        state.archive = archive;
    },
    [types.UPDATE_SERVICEWORKER](state, serviceworker: number): void {
        state.serviceworker = serviceworker;
    },
    [types.UPDATE_ERROR](state, error: string): void {
        state.error = error;
    }
};
