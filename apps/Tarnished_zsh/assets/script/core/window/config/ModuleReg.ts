import { Component } from 'cc';
import { WindowCtrl } from '../WindowCtrl';
import { NoticeWindowCtrl } from '../../../ui/notice/NoticeWindowCtrl';
import { LoginWindowCtrl } from '../../../ui/login/LoginWindowCtrl';
import { MainGameWindowCtrl } from '../../../ui/mainGame/MainGameWindowCtrl';



/**模块类名注册，窗口名字必须注册 */
export default class ModuleReg {

    NoticeWindow
	/**公告 */
	static NoticeWindow = "NoticeWindow";
	// /**登录 */
	static LoginWindow = "LoginWindow";
	static MainGameWindow = "MainGameWindow";
	// /**加载 */
	// static LoadingWindow = "LoadingWindow";
	// /**主 */
	// static PlazaWindow = "PlazaWindow";
	// /**测试 */
	// static TestWindow = "TestWindow";
	// /**测试1 */
	// static Test1Window = "Test1Window";
	// /**GM */
	// static GMWindow = "GMWindow";
	// static GMItemWindow = "GMItemWindow";
	// static GMCommandWindow = "GMCommandWindow";


	private static regClass: Map<string, WindowCtrl<Component>>;
	static init() {
		this.regClass = new Map<string, WindowCtrl<Component>>();

		this.regClass.set(ModuleReg.NoticeWindow, new NoticeWindowCtrl());
		this.regClass.set(ModuleReg.LoginWindow, new LoginWindowCtrl());
		this.regClass.set(ModuleReg.MainGameWindow, new MainGameWindowCtrl());

		// this.regClass.set(ModuleReg.LoadingWindow, new LoadingWindowCtrl());
		// this.regClass.set(ModuleReg.PlazaWindow, new PlazaWindowCtrl());
		// this.regClass.set(ModuleReg.ShowItemWindow, new ShowItemWindowCtrl());
		// this.regClass.set(ModuleReg.ItemTipsWindow, new ItemTipsWindowCtrl());
		// this.regClass.set(ModuleReg.EquipTipsWindow, new EquipTipsWindowCtrl());
		// this.regClass.set(ModuleReg.GMWindow, new GMWindowCtrl());
		// this.regClass.set(ModuleReg.GMItemWindow, new GMItemWindowCtrl()); 
		// this.regClass.set(ModuleReg.GMCommandWindow, new GMCommandWindowCtrl());
		// this.regClass.set(ModuleReg.TestWindow, new TestWindowCtrl());
		// this.regClass.set(ModuleReg.Test1Window, new Test1WindowCtrl());
		// this.regClass.set(ModuleReg.EquipWearWindow, new EquipWearWindowCtrl());
		// this.regClass.set(ModuleReg.EquipSwapWindow, new EquipSwapWindowCtrl());
		// this.regClass.set(ModuleReg.RoleAllAttrWindow, new RoleAllAttrWindowCtrl());
		// this.regClass.set(ModuleReg.RoleWindow, new RoleWindowCtrl());
		// this.regClass.set(ModuleReg.FightWindow, new FightWindowCtrl());
		// this.regClass.set(ModuleReg.FightWinWindow, new FightWinWindowCtrl());
		// this.regClass.set(ModuleReg.FightDefeatWindow, new FightDefeatWindowCtrl());
		// this.regClass.set(ModuleReg.FightRoleInfoWindow, new FightRoleInfoWindowCtrl());
		// this.regClass.set(ModuleReg.FightLoadingWindow, new FightLoadingWindowCtrl());
		// this.regClass.set(ModuleReg.AdventureWindow, new AdventureWindowCtrl());
		// this.regClass.set(ModuleReg.PetWindow, new PetWindowCtrl());
		// this.regClass.set(ModuleReg.PetLotteryWindow, new PetLotteryWindowCtrl());
		// this.regClass.set(ModuleReg.PetLotteryAwardWindow, new PetLotteryAwardWindowCtrl());
		// this.regClass.set(ModuleReg.PetProbabilityWindow, new PetProbabilityWindowCtrl());
		// this.regClass.set(ModuleReg.PetLogWindow, new PetLogWindowCtrl());
		// this.regClass.set(ModuleReg.SkillTipsWindow, new SkillTipsWindowCtrl());
		// this.regClass.set(ModuleReg.BagWindow, new BagWindowCtrl());
		// this.regClass.set(ModuleReg.RechargeMallWindow, new RechargeMallWindowCtrl());
		// this.regClass.set(ModuleReg.ItemUseWindow, new ItemUseWindowCtrl());
		// this.regClass.set(ModuleReg.ItemBuyWindow, new ItemBuyWindowCtrl());
		// this.regClass.set(ModuleReg.RankWindow, new RankWindowCtrl());
		// this.regClass.set(ModuleReg.TowerRewardWindow, new TowerRewardWindowCtrl());
		// this.regClass.set(ModuleReg.FightTestWindow, new FightTestWindowCtrler());
		// this.regClass.set(ModuleReg.ArenaWindow, new ArenaWindowCtrl());
		// this.regClass.set(ModuleReg.ArenaRewardWindow, new ArenaRewardWindowCtrl());
		// this.regClass.set(ModuleReg.ArenaLogWindow, new ArenaLogWindowCtrl());
	}

	/**
	 * 获取控制类
	 * @param winName 名
	 * @returns 
	 */
	static getClass(winName) {
        console.log("this.regClass",this.regClass);
		if (this.regClass.has(winName)) {
			return this.regClass.get(winName);
		}
		return null;
	}
}


