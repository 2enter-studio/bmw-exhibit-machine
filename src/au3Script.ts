import fs from 'fs';
import { exec } from 'child_process';

const { UE_PROJ_PATH, UE_EDITOR_PATH, OBS_PATH, AUTOIT_PATH, UE_PLAY_BTN_POS, UE_WAIT_TIME } =
	Bun.env;

if (
	!UE_PROJ_PATH ||
	!UE_EDITOR_PATH ||
	!OBS_PATH ||
	!AUTOIT_PATH ||
	!UE_PLAY_BTN_POS ||
	!UE_WAIT_TIME
) {
	throw new Error('env not set');
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

	open_ue()
	sleep(${UE_WAIT_TIME})

	WinActivate("[REGEXPTITLE:Unreal Editor.*]")
	sleep(1000)
	MouseMove(${UE_PLAY_BTN_POS})
	sleep(3000)
	MouseClick("left")
	sleep(5000)
		
	${`
	Send("{Alt down}{p down}{p up}{Alt up}")
	sleep(2000)
	`.repeat(5)}

	open_obs()
	sleep(1000)

	WinActivate("[REGEXPTITLE:Unreal Editor.*]")
	MouseMove(0, 0)

	sleep(3000)
	Exit
`;
function runAu3() {
	exec(`"${AUTOIT_PATH}" ./bot.au3`);
}

function genAu3Script() {
	fs.writeFileSync('bot.au3', script);
}

export { genAu3Script, runAu3 };
