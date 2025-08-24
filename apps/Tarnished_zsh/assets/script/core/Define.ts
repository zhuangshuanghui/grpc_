/** 窗口状态 */
export enum ViewState {
    /** 初始化 */
    init,
    /** 加载中 */
    loading,
    /** 已加载 */
    loaded,
    /** 已銷毀 */
    destroy,
}

/**
 * 层级类型
 */
export enum LayerType {
    /** 主游戏层，如地图 */
    Game = "LayerGame",
    /** UI普通窗口层，如全屏窗口 */
    Window = "LayerWindow",
    /** 二级弹窗层 */
    PopUp = "LayerPopUp",
    /** Tips窗口,断线重连,飘字 */
    Tips = "LayerTips",
    /**新手引导层 */
    Guide = "LayerGuide",
    /** 最高层级，如Loading，系统飘字*/
    Top = "LayerTop",
}

//UI常量
export enum UIConst {
    Width = 1920,
    Height = 1080,
    Top = 0,
    Left = 0,
}


/** 关闭模式 */
export enum CloseMode {
    /** 关闭但不销毁，用于频繁打开的窗口 */
    Close,
    /** 默认延迟销毁(关闭后先缓存一定时间内没再打开就销毁)，用于常打开窗口 */
    Delay,
    /** 立即销毁，用于极少打开的窗口，如某些活动类窗口 */
    Destroy,
}


/** 主角状态 */
export enum PARAMS_NAME_ENUM {
    IDLE = 'IDLE',    //待机
    ATTACK = 'ATTACK', //攻击
    JUMP = 'Jump',  //跳跃
    SQUAT = 'SQUAT', //下蹲
    DEATH='DEATH',  //死亡
    AIRDEATH='AIRDEATH',//空中死亡
    DOBELJUMP='DOBELJUMP',  //双连跳
    ISAIRING='ISAIRING',
    RUN = "RUN", //空中状态

    COMBOATTACK_COUNT='COMBOATTACK_COUNT',
    COMBOATTACK_1="COMBOATTACK_1",  //普通攻击第一段
    COMBOATTACK_2="COMBOATTACK_2",  //普通攻击第一段
    COMBOATTACK_3="COMBOATTACK_3",  //普通攻击第一段
    COMBOATTACK_4="COMBOATTACK_4",  //普通攻击第一段


}

/** 主角是否空中状态 */
export enum PARAMS_NAME_ISAIR_ENUM {
    FLOOR = 0,    
    AIR = 1, 
}

/** 主角的子状态机 */
export enum SUB_SATEMACHINE{
    IDLE = 'IDLE',    //待机
    ATTACK = 'ATTACK', //攻击
    JUMP = 'Jump',  //跳跃
    SQUAT = 'SQUAT', //下蹲
    DEATH='DEATH',  //死亡
    DOBELJUMP='DOBELJUMP',  //双连跳
    AIRING='AIRING', //空中状态
    AIRDEATH='AIRDEATH', //空中死亡
}

/**用于识别游戏里每个角色的身份 */
export enum HUMAN{
    PLAYER='PLAYER',
    NPC1='NPC1',
}

