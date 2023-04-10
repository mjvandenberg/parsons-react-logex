import { ValidatedParsonsItem, ParsonsItem, b, r } from "../types";

export const parseTestHr
    : (arr: string[]) => [ParsonsItem[], ParsonsItem[], ValidatedParsonsItem[]]
    = (arr) => {
        const y = arr
            .map<string[]>((s, i) => s.split(","));
        const u =
            [0, 1, 2].map<string>((i) => {
                const m: string[] = y.map<string>((s) => s[i]);
                return m.join()
            });

        return parseTest(u);
    }

export const parseTest
    : (arr: string[]) => [ParsonsItem[], ParsonsItem[], ValidatedParsonsItem[]]
    = (arr) => {
        const solution = stringToParsonsItems(arr[0]);
        const learners = stringToParsonsItems(arr[1]);
        const expected = toExpectedResult(arr[2], learners);
        return [
            solution,
            learners,
            expected
        ];
    }

export const stringToParsonsItems: (input: string) => ParsonsItem[] = (input) => {
    return input
        .split(",")
        .map<ParsonsItem | null>((e, i) => {
            if (e === "" || e === " ") {
                return null;
            }
            return {
                text: e,
                type: i % 2 === 0 ? b : r
            };
        })
        .reduce<ParsonsItem[]>((acc, curr) => {
            if (curr === null) {
                return acc;
            }
            return [...acc, curr];
        }, []);
}

export const toExpectedResult: (input: string, learners: ParsonsItem[]) => ValidatedParsonsItem[] = (input, learners) => {
    return input
        .split(",")
        .map<ValidatedParsonsItem | null>((e, i) => {
            if (e === "" || e === " ") {
                return null;
            }
            return {
                text: learners[i].text,
                type: learners[i].type,
                status: e === "r" ? "red" : e === "?" ? "unknown" : e === "y" ? "yellow" : "green",
            };
        })
        .reduce<ValidatedParsonsItem[]>((acc, curr) => {
            if (curr === null) {
                return acc;
            }
            return [...acc, curr];
        }, []);
}