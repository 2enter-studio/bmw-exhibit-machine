import fs from 'fs'
const {UE_PROJ_PATH, UE_EDITOR_PATH, OBS_PATH, AUTOIT_PATH} = Bun.env
import {exec} from 'child_process'

if (!UE_PROJ_PATH || !UE_EDITOR_PATH || !OBS_PATH || !AUTOIT_PATH) {
	throw new Error('env not set')
}

const script = `
	Global $ue_project = "${UE_PROJ_PATH}"
	Global $ue_editor = "${UE_EDITOR_PATH}"
	Global $obs_path = "${OBS_PATH}"

	Func open_obs()
		Run($obs_path, "${OBS_PATH.replace('obs64.exe', '')}")
	EndFunc

	Func open_ue()
		Run($ue_editor & " " & '"' & $ue_project & '"')
	EndFunc

	open_obs()
	sleep(1000)

	open_ue()
	sleep(5000)

	open_arena()
	sleep(80000)

	WinActivate("[REGEXPTITLE:Unreal Editor.*]")
	sleep(1000)
	MouseMove(590, 90)
	sleep(3000)
	MouseClick("left")
	sleep(5000)
		
	${`
			Send("{Alt down}{p down}{p up}{Alt up}")
			sleep(2000)
		`.repeat(5)}

		WinActivate("[REGEXPTITLE:Unreal Editor.*]")
		MouseMove(590, 50)

	sleep(3000)
	Exit
`
function runAu3() {
	exec(`"${AUTOIT_PATH}" ./bot.au3`);
}

function genAu3Script() {
	fs.writeFileSync('bot.au3', script)
}

export {genAu3Script, runAu3}
