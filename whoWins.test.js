import { whoWins } from "./App"

const grid = [
			[1, 1, 1],
			[0, 0, 0],
			[0, 0, 0]
				]
const size = 3

test("whoWins returns 1 given [1,1,1]", () => {
	expect(whoWins(0,0)).toEqual(1)
})