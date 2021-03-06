//Variable initialization
var PlayExtra_KeyEnterID;
var PlayExtra_clear = false;
var PlayExtra_selectedChannel = '';
var PlayExtra_selectedChannelDisplayname = '';
var PlayExtra_loadingDataTry = 0;
var PlayExtra_state = Play_STATE_LOADING_TOKEN;
var PlayExtra_qualities;
//var PlayExtra_qualityIndex = 0;
//var PlayExtra_playingUrl = '';
var PlayExtra_quality = "Auto";
var PlayExtra_qualityPlaying = PlayExtra_quality;
var PlayExtra_selectedChannel_id = 0;
var PlayExtra_IsRerun = false;
var PlayExtra_gameSelected = '';
var PlayExtra_isHost = '';
var PlayExtra_DisplaynameHost = '';
var PlayExtra_PicturePicture = false;
//var PlayExtra_SupportsSource = true;
var PlayExtra_AutoUrl = '';

//var PlayExtra_SupportsSource_Old;
var PlayExtra_selectedChannel_id_Old;
var PlayExtra_IsRerun_Old;
var PlayExtra_selectedChannel_Old;
var PlayExtra_isHost_Old;
var PlayExtra_DisplaynameHost_Old;
var PlayExtra_selectedChannelDisplayname_Old;
var PlayExtra_gameSelected_Old;
var PlayExtra_qualities_Old;
var PlayExtra_qualityPlaying_Old;
var PlayExtra_quality_Old;
var PlayExtra_AutoUrl_Old;
var PlayExtra_BroadcastID;

var PlayExtra_RefreshAutoTry = 0;

var PlayExtra_Save_selectedChannel_id_Old = null;
var PlayExtra_Save_IsRerun_Old = null;
var PlayExtra_Save_selectedChannel_Old = null;
var PlayExtra_Save_DisplaynameHost_Old = null;
var PlayExtra_Save_selectedChannelDisplayname_Old = null;
var PlayExtra_Save_gameSelected_Old = null;
var PlayExtra_WasPicturePicture = false;

function PlayExtra_ResetSpeed() {
    Play_controls[Play_controlsSpeed].defaultValue = Play_CurrentSpeed;
    Play_controls[Play_controlsSpeed].bottomArrows();
    Play_controls[Play_controlsSpeed].setLable();
}

function PlayExtra_ResetAudio() {
    //After setting we only reset this if the app is close/re opened
    Play_controls[Play_controlsAudio].defaultValue = Play_controlsAudioPos;
    Play_controls[Play_controlsAudio].bottomArrows();
    Play_controls[Play_controlsAudio].setLable();
}

function PlayExtra_SavePlayData() {
    PlayExtra_Save_selectedChannel_id_Old = PlayExtra_selectedChannel_id;
    PlayExtra_Save_IsRerun_Old = PlayExtra_IsRerun;
    PlayExtra_Save_selectedChannel_Old = PlayExtra_selectedChannel;
    PlayExtra_Save_DisplaynameHost_Old = PlayExtra_DisplaynameHost;
    PlayExtra_Save_selectedChannelDisplayname_Old = PlayExtra_selectedChannelDisplayname;
    PlayExtra_Save_gameSelected_Old = PlayExtra_gameSelected;
}

function PlayExtra_RestorePlayData() {
    Play_showWarningDialog(PlayExtra_selectedChannelDisplayname + ' ' + STR_LIVE + STR_IS_OFFLINE);
    window.setTimeout(function() {
        Play_HideWarningDialog();
    }, 2000);

    PlayExtra_selectedChannel_id = PlayExtra_Save_selectedChannel_id_Old;
    PlayExtra_Save_selectedChannel_id_Old = null;

    PlayExtra_IsRerun = PlayExtra_Save_IsRerun_Old;
    PlayExtra_selectedChannel = PlayExtra_Save_selectedChannel_Old;
    PlayExtra_DisplaynameHost = PlayExtra_Save_DisplaynameHost_Old;
    PlayExtra_selectedChannelDisplayname = PlayExtra_Save_selectedChannelDisplayname_Old;
    PlayExtra_gameSelected = PlayExtra_Save_gameSelected_Old;
}

function PlayExtra_KeyEnter() {
    PlayExtra_clear = true;

    var doc = document.getElementById(UserLiveFeed_ids[8] + Play_FeedPos);
    if (doc === null) UserLiveFeed_ResetFeedId();
    else {
        Main_values_Play_data = JSON.parse(doc.getAttribute(Main_DataAttribute));

        if (Main_values.Play_selectedChannel !== Main_values_Play_data &&
            PlayExtra_selectedChannel[6] !== Main_values_Play_data) {

            UserLiveFeed_Hide();

            Main_ready(function() {
                PlayExtra_WasPicturePicture = PlayExtra_PicturePicture;

                if (PlayExtra_WasPicturePicture) {
                    //PlayExtra_PicturePicture was alredy enable so save data and update live historyinfo
                    PlayExtra_updateStreamInfo();
                    PlayExtra_SavePlayData();
                } else PlayExtra_Save_selectedChannel_id_Old = null;

                PlayExtra_PicturePicture = true;

                Main_values.Play_isHost = false;
                Play_UserLiveFeedPressed = true;

                PlayExtra_selectedChannel = Main_values_Play_data[6];
                PlayExtra_BroadcastID = Main_values_Play_data[7];
                PlayExtra_selectedChannel_id = Main_values_Play_data[14];
                PlayExtra_IsRerun = Main_values_Play_data[8];

                PlayExtra_isHost = false;
                PlayExtra_selectedChannelDisplayname = document.getElementById(UserLiveFeed_ids[3] + Play_FeedPos).textContent;

                Main_innerHTML('chat_container2_name_text', STR_SPACE + PlayExtra_selectedChannelDisplayname + STR_SPACE);

                PlayExtra_DisplaynameHost = Main_values.Play_DisplaynameHost;

                var playing = document.getElementById(UserLiveFeed_ids[5] + Play_FeedPos).textContent;
                PlayExtra_gameSelected = playing.indexOf(STR_PLAYING) !== -1 ? playing.split(STR_PLAYING)[1] : "";

                if (Main_IsNotBrowser) {
                    //Not on auto mode for change to auto before start picture in picture
                    if (Play_quality.indexOf("Auto") === -1) Android.StartAuto(1, 0);

                    Play_quality = "Auto";
                    Play_qualityPlaying = Play_quality;
                    PlayExtra_quality = "Auto";
                    PlayExtra_qualityPlaying = PlayExtra_quality;
                }
                PlayExtra_Resume();
            });
        } else UserLiveFeed_ResetFeedId();
    }
}

function PlayExtra_Resume() {
    // restart audio source position to where ther user has left it
    if (Main_IsNotBrowser) Android.mSwitchPlayerAudio(Play_controlsAudioPos);
    Play_SetAudioIcon();
    PlayExtra_state = Play_STATE_LOADING_TOKEN;
    PlayExtra_loadingDataTry = 0;
    PlayExtra_loadDataRequest();
}

function PlayExtra_SwitchPlayerStoreOld() {
    PlayExtra_selectedChannel_id_Old = Main_values.Play_selectedChannel_id;
    PlayExtra_IsRerun_Old = Main_values.IsRerun;
    PlayExtra_selectedChannel_Old = Main_values.Play_selectedChannel;
    PlayExtra_isHost_Old = Play_isHost;
    PlayExtra_DisplaynameHost_Old = Main_values.Play_DisplaynameHost;
    PlayExtra_selectedChannelDisplayname_Old = Main_values.Play_selectedChannelDisplayname;
    PlayExtra_gameSelected_Old = Main_values.Play_gameSelected;
    PlayExtra_qualities_Old = Play_qualities;
    PlayExtra_qualityPlaying_Old = Play_qualityPlaying;
    PlayExtra_quality_Old = Play_quality;
    //PlayExtra_SupportsSource_Old = Play_SupportsSource;
    PlayExtra_AutoUrl_Old = Play_AutoUrl;
}

function PlayExtra_SwitchPlayerResStoreOld() {
    PlayExtra_selectedChannel_id = PlayExtra_selectedChannel_id_Old;
    PlayExtra_IsRerun = PlayExtra_IsRerun_Old;
    PlayExtra_selectedChannel = PlayExtra_selectedChannel_Old;
    PlayExtra_isHost = PlayExtra_isHost_Old;
    PlayExtra_DisplaynameHost = PlayExtra_DisplaynameHost_Old;
    PlayExtra_selectedChannelDisplayname = PlayExtra_selectedChannelDisplayname_Old;
    PlayExtra_gameSelected = PlayExtra_gameSelected_Old;
    PlayExtra_qualities = PlayExtra_qualities_Old;
    PlayExtra_qualityPlaying = PlayExtra_qualityPlaying_Old;
    PlayExtra_quality = PlayExtra_quality_Old;
    PlayExtra_AutoUrl = PlayExtra_AutoUrl_Old;
    //PlayExtra_SupportsSource = PlayExtra_SupportsSource_Old;
}

function PlayExtra_SwitchPlayer() {
    PlayExtra_SwitchPlayerStoreOld();
    Main_values.Play_selectedChannel_id = PlayExtra_selectedChannel_id;
    Main_values.IsRerun = PlayExtra_IsRerun;
    Main_values.Play_selectedChannel = PlayExtra_selectedChannel;

    Play_isHost = PlayExtra_isHost;

    if (Play_isHost) {
        Main_values.Play_DisplaynameHost = PlayExtra_DisplaynameHost;
        Main_values.Play_selectedChannelDisplayname = Main_values.Play_DisplaynameHost.split(STR_USER_HOSTING)[1];
    } else Main_values.Play_selectedChannelDisplayname = PlayExtra_selectedChannelDisplayname;

    Main_values.Play_gameSelected = PlayExtra_gameSelected;

    if (Main_values.Main_Go === Main_aGame) Main_values.Main_OldgameSelected = Main_values.Main_gameSelected;
    Play_loadingInfoDataTry = 0;
    Play_updateStreamInfoStart();
    Play_loadChat();

    Play_qualities = PlayExtra_qualities;
    Play_qualityPlaying = PlayExtra_qualityPlaying;
    Play_quality = PlayExtra_quality;
    //Play_SupportsSource = PlayExtra_SupportsSource;
    Play_AutoUrl = PlayExtra_AutoUrl;

    PlayExtra_SwitchPlayerResStoreOld();
    Main_SaveValues();

    Main_innerHTML('chat_container2_name_text', STR_SPACE + PlayExtra_selectedChannelDisplayname + STR_SPACE);
    Main_innerHTML('chat_container_name_text', STR_SPACE + Main_values.Play_selectedChannelDisplayname + STR_SPACE);
}

function PlayExtra_ShowChat() {
    Main_ShowElement('chat_container2');
    Main_ShowElement('chat_container_name');
    Main_ShowElement('chat_container2_name');
}

function PlayExtra_HideChat() {
    Main_HideElement('chat_container2');
    Main_HideElement('chat_container_name');
    Main_HideElement('chat_container2_name');
}

function PlayExtra_End(doSwitch) { // Called only by JAVA
    //Some player ended switch and warn
    if (doSwitch) PlayExtra_SwitchPlayer();

    //If in 50/50 fix postion
    if (!Play_isFullScreen) {
        Play_isFullScreen = !Play_isFullScreen;
        Play_SetFullScreen(Play_isFullScreen);
    } // else if (doSwitch) Android.mSwitchPlayer(); // else if doSwitch switch small to big

    PlayExtra_PicturePicture = false;
    ChatLive_Clear(1);
    PlayExtra_HideChat();
    PlayExtra_UnSetPanel();

    Play_showWarningDialog(PlayExtra_selectedChannelDisplayname + ' ' + STR_LIVE + STR_IS_OFFLINE);
    window.setTimeout(function() {
        Play_HideWarningDialog();
    }, 2500);
    PlayExtra_selectedChannel = '';
}

function PlayExtra_loadDataSuccess(responseText) {
    if (PlayExtra_state === Play_STATE_LOADING_TOKEN) {
        Play_tokenResponse = JSON.parse(responseText);
        PlayExtra_state = Play_STATE_LOADING_PLAYLIST;
        PlayExtra_loadingDataTry = 0;
        PlayExtra_loadDataRequest();
    } else if (PlayExtra_state === Play_STATE_LOADING_PLAYLIST) {

        //Low end device will not support High Level 5.2 video/mp4; codecs="avc1.640034"
        //        if (!Main_SupportsAvc1High && PlayExtra_SupportsSource && responseText.indexOf('avc1.640034') !== -1) {
        //            PlayExtra_SupportsSource = false;
        //            PlayExtra_loadingDataTry = 0;
        //            PlayExtra_loadDataRequest();
        //            return;
        //        }

        Android.SetAuto2(PlayExtra_AutoUrl);
        PlayExtra_qualities = Play_extractQualities(responseText);
        PlayExtra_state = Play_STATE_PLAYING;
        PlayExtra_SetPanel();
        if (Play_isOn) PlayExtra_qualityChanged();
        PlayExtra_Save_selectedChannel_id_Old = null;
        ChatLive_Playing = true;

        if (!Play_isFullScreen) {
            Android.mupdatesizePP(!Play_isFullScreen);
            ChatLive_Init(1);
            PlayExtra_ShowChat();
        }
        Main_Set_history('live');
        Play_loadingInfoDataTry = 0;
        Play_updateVodInfo(PlayExtra_selectedChannel_id, PlayExtra_BroadcastID, 0);
    }
}

function PlayExtra_SetPanel() {
    Play_controls[Play_controlsChatSide].setLable();
    Play_controls[Play_controlsChatSide].setIcon();
    document.getElementById('controls_' + Play_controlsQuality).style.display = 'none';
    document.getElementById('controls_' + Play_controlsAudio).style.display = '';
    document.getElementById('controls_' + Play_controlsQualityMini).style.display = '';
    Play_IconsResetFocus();
}

function PlayExtra_UnSetPanel() {
    Play_controls[Play_controlsChatSide].setLable();
    Play_controls[Play_controlsChatSide].setIcon();
    document.getElementById('controls_' + Play_controlsQuality).style.display = '';
    document.getElementById('controls_' + Play_controlsAudio).style.display = 'none';
    document.getElementById('controls_' + Play_controlsQualityMini).style.display = 'none';
    Play_IconsResetFocus();
    PlayExtra_HideChat();
}

function PlayExtra_qualityChanged() {
    if (Main_IsNotBrowser && Play_isOn) Android.initializePlayer2Auto();

    if (Main_AndroidSDK < 26 && Main_values.check_pp_workaround && !Settings_Obj_default("pp_workaround")) {

        Main_ShowElement('dialog_os');
        document.body.removeEventListener("keydown", Play_handleKeyDown, false);
        document.body.addEventListener("keydown", PlayExtra_handleKeyDown, false);

        Main_values.check_pp_workaround = false;
        Main_SaveValues();
    }

    if (Main_isDebug) console.log('PlayExtra_onPlayer: Auto');
}

function PlayExtra_handleKeyDown(e) {
    if (e.keyCode === KEY_RETURN || e.keyCode === KEY_RETURN_Q || e.keyCode === KEY_KEYBOARD_BACKSPACE) {

        document.body.removeEventListener("keydown", PlayExtra_handleKeyDown, false);
        document.body.addEventListener("keydown", Play_handleKeyDown, false);
        Main_HideElement('dialog_os');

    }
}

function PlayExtra_loadDataRequest() {
    var theUrl, state = PlayExtra_state === Play_STATE_LOADING_TOKEN;

    if (state) {
        theUrl = 'https://api.twitch.tv/api/channels/' + PlayExtra_selectedChannel + '/access_token?platform=_' +
            (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token && !Play_410ERROR ? '&oauth_token=' +
                AddUser_UsernameArray[0].access_token : '');
    } else {
        theUrl = 'https://usher.ttvnw.net/api/channel/hls/' + PlayExtra_selectedChannel +
            '.m3u8?&token=' + encodeURIComponent(Play_tokenResponse.token) + '&sig=' + Play_tokenResponse.sig +
            '&reassignments_supported=true&playlist_include_framerate=true&fast_bread=true&allow_source=true' +
            (Main_vp9supported ? '&preferred_codecs=vp09' : '') + '&p=' + Main_RandomInt();

        //(PlayExtra_SupportsSource ? "&allow_source=true" : '') +
        //(Main_vp9supported ? '&preferred_codecs=vp09' : '') + '&p=' + Main_RandomInt();

        PlayExtra_AutoUrl = theUrl;
    }

    var xmlHttp;
    if (Main_IsNotBrowser) {
        try {
            if (state) xmlHttp = Android.mreadUrlHLS(theUrl);
            else xmlHttp = Android.mreadUrl(theUrl, 3000, 0, null);
        } catch (e) {}

        if (xmlHttp) {
            PlayExtra_loadDataSuccessreadyState(JSON.parse(xmlHttp));
        } else Play_loadDataError();

    } else {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.timeout = Play_loadingDataTimeout;
        xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);

        xmlHttp.ontimeout = function() {};

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4) PlayExtra_loadDataSuccessreadyState(xmlHttp);
        };

        xmlHttp.send(null);
    }
}

function PlayExtra_loadDataSuccessreadyState(xmlHttp) {
    if (xmlHttp.status === 200) {

        if (xmlHttp.responseText.indexOf('"status":410') !== -1) {
            Play_410ERROR = true;
            PlayExtra_loadDataError();
        } else {
            Play_410ERROR = false;
            Play_loadingDataTry = 0;
            PlayExtra_loadDataSuccess(xmlHttp.responseText);
        }

    } else if (xmlHttp.status === 403) { //forbidden access
        PlayExtra_loadDataFail(STR_FORBIDDEN);
    } else if (xmlHttp.status === 404) { //off line
        PlayExtra_loadDataFail(PlayExtra_selectedChannelDisplayname + ' ' + STR_LIVE + STR_IS_OFFLINE);
    } else PlayExtra_loadDataError();
}

function PlayExtra_loadDataError() {
    if (Play_isOn && Play_isLive) {
        PlayExtra_loadingDataTry++;
        if (PlayExtra_loadingDataTry < Play_loadingDataTryMax) PlayExtra_loadDataRequest();
        else PlayExtra_loadDataFail(STR_PLAYER_PROBLEM_2);
    }
}

function PlayExtra_loadDataFail(Reason) {
    if (PlayExtra_Save_selectedChannel_id_Old === null) {

        PlayExtra_PicturePicture = false;
        PlayExtra_selectedChannel = '';
        ChatLive_Clear(1);
        Main_HideElement('chat_container2');
        if (Main_IsNotBrowser && !Play_isFullScreen) Android.mupdatesize(!Play_isFullScreen);

        Play_HideBufferDialog();
        Play_showWarningDialog(Reason);
        window.setTimeout(function() {
            Play_HideWarningDialog();
        }, 2500);
    } else PlayExtra_RestorePlayData();
}

function PlayExtra_RefreshAutoRequest(UseAndroid) {
    var theUrl = 'https://api.twitch.tv/api/channels/' + PlayExtra_selectedChannel + '/access_token?platform=_' +
        (AddUser_UserIsSet() && AddUser_UsernameArray[0].access_token && !Play_410ERROR ? '&oauth_token=' +
            AddUser_UsernameArray[0].access_token : '');

    var xmlHttp;

    try {
        xmlHttp = Android.mreadUrlHLS(theUrl);
    } catch (e) {}

    if (xmlHttp) PlayExtra_RefreshAutoRequestSucess(JSON.parse(xmlHttp), UseAndroid);
    else PlayExtra_RefreshAutoError(UseAndroid);
}

function PlayExtra_RefreshAutoRequestSucess(xmlHttp, UseAndroid) {
    if (xmlHttp.status === 200) {
        PlayExtra_RefreshAutoTry = 0;
        Play_tokenResponse = JSON.parse(xmlHttp.responseText);
        //410 error
        if (!Play_tokenResponse.hasOwnProperty('token') || !Play_tokenResponse.hasOwnProperty('sig') ||
            xmlHttp.responseText.indexOf('"status":410') !== -1) {
            Play_410ERROR = true;
            PlayExtra_RefreshAutoError(UseAndroid);
            return;
        }
        Play_410ERROR = false;

        var theUrl = 'https://usher.ttvnw.net/api/channel/hls/' + PlayExtra_selectedChannel +
            '.m3u8?&token=' + encodeURIComponent(Play_tokenResponse.token) + '&sig=' + Play_tokenResponse.sig +
            '&reassignments_supported=true&playlist_include_framerate=true&fast_bread=true' +
            '&reassignments_supported=true&playlist_include_framerate=true&fast_bread=true&allow_source=true' +
            (Main_vp9supported ? '&preferred_codecs=vp09' : '') + '&p=' + Main_RandomInt();

        //(PlayExtra_SupportsSource ? "&allow_source=true" : '') +
        //(Main_vp9supported ? '&preferred_codecs=vp09' : '') + '&p=' + Main_RandomInt();

        PlayExtra_AutoUrl = theUrl;

        if (UseAndroid) Android.ResStartAuto2(theUrl);
        else Android.SetAuto2(theUrl);

    } else PlayExtra_RefreshAutoError(UseAndroid);
}

function PlayExtra_RefreshAutoError(UseAndroid) {
    if (Play_isOn) {
        PlayExtra_RefreshAutoTry++;
        if (PlayExtra_RefreshAutoTry < 5) PlayExtra_RefreshAutoRequest(UseAndroid);
        else if (UseAndroid) PlayExtra_loadDataFail(STR_PLAYER_PROBLEM_2);
    }
}

function PlayExtra_updateStreamInfo() {
    var theUrl = Main_kraken_api + 'streams/' + PlayExtra_selectedChannel_id + Main_TwithcV5Flag_I;
    BasexmlHttpGet(theUrl, 3000, 2, null, PlayExtra_updateStreamInfoValues, PlayExtra_updateStreamInfoError);
}

function PlayExtra_updateStreamInfoValues(response) {
    response = JSON.parse(response);
    if (response.stream !== null) {
        Main_history_UpdateLive(
            response.stream._id,
            response.stream.game,
            response.stream.channel.status,
            response.stream.viewers
        );
    }
}

function PlayExtra_updateStreamInfoError() {
    if (Play_updateStreamInfoErrorTry < Play_loadingInfoDataTryMax) {
        window.setTimeout(function() {
            if (Play_isOn) PlayExtra_updateStreamInfo();
            //give a second for it retry as the TV may be on coming from resume
        }, 2500);
        Play_updateStreamInfoErrorTry++;
    } else Play_updateStreamInfoErrorTry = 0;
}
