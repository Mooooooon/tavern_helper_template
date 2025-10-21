<template>
  <div
    class="QQ"
    id="App_QQ"
    style="width: 100%; height: 100%; box-sizing: border-box; position: relative"
    :style="{
      'background-color': sharedState.QQ.activePage == 1 ? '#eff3ff' : '#FFFFFF',
    }"
    v-show="sharedState.phone.activeApp == 'QQ'"
  >
    <div id="QQ_home_page" v-show="!sharedState.QQ.activeChatId && sharedState.QQ.activePage == 1">
      <div style="width: 100%; height: 30px"></div>
      <div style="display: flex; align-items: center; gap: 5px; width: 100%; box-sizing: border-box">
        <!-- <img src="http://sharkpan.xyz/f/Z7Hr/%E8%82%A5%E8%82%A5%E9%B2%A8%E5%90%83%E8%9B%8B%E7%B3%95.jpg" alt="加载失败"
              style="width: 35px;height: 35px;border-radius: 50%;margin-left: 10px;"> -->
        <div
          @click="goHome"
          class="user_avatar"
          style="width: 35px; height: 35px; border-radius: 50%; margin-left: 10px"
        ></div>
        <div
          style="
            display: flex;
            align-items: start;
            justify-content: center;
            flex-direction: column;
            margin-left: 3px;
            gap: 3px;
          "
        >
          <span style="font-size: 15px; color: black !important" id="QQ_home_UserName"
            ><strong>{{ sharedState.ST.userName }}</strong></span
          >
          <div style="display: flex; align-items: center; height: 10px">
            <svg viewBox="0 0 1024 1024" width="13" height="13" style="margin-right: 2px">
              <path
                d="M957.539 464.339c-26.14-245.993-246.771-424.08-492.787-397.772C218.735 92.873 40.474 313.62 66.635 559.634 92.774 805.631 313.406 983.717 559.443 957.41c245.997-26.306 424.258-247.075 398.096-493.071z m-298.25-135.757c39.341 0 71.233 31.921 71.233 71.301 0 39.379-31.891 71.3-71.233 71.3-39.338 0-71.229-31.921-71.229-71.3 0-39.38 31.892-71.301 71.229-71.301z m-294.447 0c39.34 0 71.23 31.921 71.23 71.301 0 39.379-31.89 71.3-71.23 71.3s-71.228-31.921-71.228-71.3c0-39.38 31.887-71.301 71.228-71.301z m366.815 304.963c-21.735 96.663-119.97 163.563-219.591 163.563-103.222 0-200.969-68.713-220.487-167.453 0-26.686 20.351-36.26 32.887-36.26h370.156c9.115 0.017 43.978 3.176 37.035 40.15z"
                fill="#fbba13"
                p-id="5845"
              ></path>
            </svg>
            <span style="font-size: 11px">Q我吧</span>
            <svg viewBox="0 0 1024 1024" width="10" height="10" style="margin-top: 1px">
              <path
                d="M342.528 916.48c19.456 0 38.4-7.168 53.248-21.504l338.944-327.68c14.848-14.336 23.552-34.304 23.552-55.296s-8.192-40.96-23.552-55.296l-338.944-327.68c-30.72-29.696-79.36-28.672-108.544 2.048-29.696 30.72-28.672 79.36 2.048 108.544l281.6 272.384-281.6 272.384c-30.72 29.696-31.232 78.336-2.048 108.544 15.36 15.872 35.328 23.552 55.296 23.552z"
                fill="#000000"
                p-id="7578"
              ></path>
            </svg>
          </div>
        </div>

        <svg
          @click="sharedState.QQ.panel = !sharedState.QQ.panel"
          viewBox="0 0 1024 1024"
          version="1.1"
          width="20"
          height="20"
          style="margin-left: auto; margin-right: 10px"
        >
          <path
            d="M512 0a42.666667 42.666667 0 0 1 42.666667 42.666667v426.666666h426.666666a42.666667 42.666667 0 0 1 0 85.333334H554.666667v426.666666a42.666667 42.666667 0 0 1-85.333334 0V554.666667H42.666667a42.666667 42.666667 0 0 1 0-85.333334h426.666666V42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
            fill="#191919"
            p-id="4261"
          ></path>
        </svg>
      </div>

      <div style="width: 100%; height: 10px"></div>
      <div id="QQ_home_chars">
        <div
          style="
            width: 100%;
            height: 30px;
            background-color: #eff3ff;
            margin-top: 5px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
          "
        >
          <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path
              d="M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0"
              fill="#919095"
            ></path>
          </svg>
          <span style="color: #919095">搜索</span>
        </div>

        <div style="width: 100%; height: 13px"></div>
        <div id="QQ_home_chars_div">
          <home_chars v-for="(value, key) in sharedState.QQ.chars" :value="value" :name="key"> </home_chars>
        </div>

        <div v-if="Object.keys(sharedState.QQ.chars).length == 0" style="text-align: center">点击右上角+添加角色</div>
        <div v-if="Object.keys(sharedState.QQ.chars).length == 0" style="text-align: center; margin-top: 4px">
          点击左上角头像修改手机颜色
        </div>
      </div>
    </div>
    <div
      id="QQ_space_page"
      v-show="!sharedState.QQ.activeChatId && sharedState.QQ.activePage == 3"
      style="height: 100%"
    >
      <div style="width: 100%; height: 35px"></div>
      <div style="display: flex">
        <span style="font-size: 16px; margin-left: 10px; color: black !important">动态</span>
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="margin-left: auto">
          <path
            d="M593.420488 922.099512c24.553022 0 44.456585 19.903563 44.456585 44.456586v11.988292c0 24.553022-19.903563 44.456585-44.456585 44.456586h-159.843903c-24.553022 0-44.456585-19.903563-44.456585-44.456586v-11.988292c0-24.553022 19.903563-44.456585 44.456585-44.456586h159.843903zM515.996098 0c24.276293 0 43.957073 19.68078 43.957073 43.957073l0.002997 54.191079C735.392843 121.808047 870.649756 272.137241 870.649756 454.056585V740.277073h102.4c24.553022 0 44.456585 19.903563 44.456585 44.456586v11.988292c0 24.553022-19.903563 44.456585-44.456585 44.456586H870.649756v1.998048H152.35122v-1.998048H52.948293C28.39527 841.178537 8.491707 821.274974 8.491707 796.721951v-11.988292C8.491707 760.180636 28.39527 740.277073 52.948293 740.277073H152.35122V454.056585c0-181.229019 134.231914-331.106654 308.696538-355.632702L461.049756 43.957073c0-24.276293 19.68078-43.957073 43.957073-43.957073h10.989269z m25.620979 197.047571h-60.233178c-126.178779 0-228.706654 101.264109-230.744664 226.958361l-0.029971 3.816273-0.000999 312.454868h521.783446V427.822205c0-127.454533-103.3211-230.774634-230.774634-230.774634z"
            fill="#000000"
            p-id="3355"
          ></path>
        </svg>
        <svg viewBox="0 0 1065 1024" width="20" height="20" style="margin-right: 10px; margin-left: 15px">
          <path
            d="M1002.234305 330.02867V693.97133c0 53.148789-28.346021 101.741967-73.902125 128.063272l-315.349481 182.224419c-46.062284 26.321305-102.248146 26.321305-148.31043 0l-315.349481-182.224419c-46.062284-26.321305-73.902126-75.420662-73.902126-128.063272V330.02867c0-53.148789 28.346021-101.741967 73.902126-128.063272l315.349481-182.224419c46.062284-26.321305 102.248146-26.321305 148.31043 0l315.349481 182.224419c45.556105 26.321305 73.902126 74.914483 73.902125 128.063272z m-76.939199 0c0-25.308947-13.666831-49.099357-35.432526-61.753831l-315.349481-182.224419c-22.271873-12.654474-49.099357-12.654474-71.37123 0l-315.349481 182.224419c-22.271873 12.654474-35.432526 36.444884-35.432526 61.753831V693.97133c0 25.308947 13.666831 49.099357 35.432526 61.753831l315.349481 182.224419c22.271873 12.654474 49.099357 12.654474 71.37123 0l315.349481-182.224419c22.271873-12.654474 35.432526-36.444884 35.432526-61.753831V330.02867zM362.424123 508.709837C362.424123 410.004943 442.400395 329.522491 541.611468 329.522491s179.187346 80.482452 179.187346 179.187346-80.482452 179.187346-179.187346 179.187345-179.187346-79.470094-179.187345-179.187345z m76.939199 0c0 56.692042 46.062284 102.248146 102.248146 102.248146s102.248146-46.062284 102.248146-102.248146-46.062284-102.248146-102.248146-102.248146-102.248146 46.568463-102.248146 102.248146z"
            fill="#000000"
            p-id="13806"
          ></path>
        </svg>
      </div>
      <div style="width: 100%; height: 1px; background-color: #e6e6e6; margin-bottom: 10px; margin-top: 10px"></div>
      <div class="space_contents" id="space_contents" style="overflow-y: auto; width: 100%; height: 100%">
        <post v-for="value of sharedState.QQ.post" :post="value"></post>
        <div style="margin-bottom: 150px"></div>
      </div>
    </div>

    <div class="QQ_bottom_nav">
      <div
        @click="sharedState.QQ.activePage = 1"
        id="QQ_message_nav"
        style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1px"
      >
        <svg
          class="icon"
          viewBox="0 0 1024 1024"
          width="20"
          height="20"
          style="transform: scale(1.15); transform-origin: center"
          :style="{
            fill: sharedState.QQ.activePage == 1 ? '#019aff' : '#000000',
          }"
          id="QQ_message_svg"
        >
          <path
            d="M822.016 61.44H196.864A155.88352 155.88352 0 0 0 40.96 216.94976v426.2144a155.88352 155.88352 0 0 0 155.904 155.50976h9.6256a1.97632 1.97632 0 0 1 1.96608 1.9456l0.97792 84.992A72.832 72.832 0 0 0 322.72896 945.152l211.37408-141.09184a31.9744 31.9744 0 0 1 17.80736-5.39648h270.1056A155.88352 155.88352 0 0 0 977.92 643.16416V216.94976A155.88352 155.88352 0 0 0 822.016 61.44z m85.06368 581.72416a85.05344 85.05344 0 0 1-85.06368 84.84864H551.936a102.69184 102.69184 0 0 0-57.21088 17.33632l-211.39456 141.09184a1.9712 1.9712 0 0 1-3.072-1.6128l-0.97792-85.02272A72.97024 72.97024 0 0 0 206.4896 728.0128h-9.6256a85.05344 85.05344 0 0 1-85.06368-84.84864V216.94976A85.05344 85.05344 0 0 1 196.864 132.096h625.152a85.05344 85.05344 0 0 1 85.06368 84.84864v426.2144z"
          ></path>
          <path
            d="M311.08608 381.76768a54.17472 54.17472 0 1 0 54.31296 54.17472 54.24128 54.24128 0 0 0-54.31296-54.17472z m207.80032 0a54.17472 54.17472 0 1 0 54.31296 54.17472 54.24128 54.24128 0 0 0-54.31296-54.17472z m212.52096 0a54.17472 54.17472 0 1 0 54.31296 54.17472 54.24128 54.24128 0 0 0-54.31296-54.17472z"
          ></path>
        </svg>
        <span>消息</span>
      </div>

      <div
        @click="sharedState.phone.activeApp = 'RedNote'"
        id="QQ_people_nav"
        style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1px"
      >
        <svg viewBox="0 0 1024 1024" style="fill: #000000" width="20" height="20" id="QQ_people_svg">
          <path
            d="M620.744191 538.879184c82.736353-40.523949 140.308583-124.785028 140.308583-222.936465 0-137.367601-111.714338-249.080915-249.02668-249.080915-137.367601 0-249.080915 111.713314-249.080915 249.080915 0 98.151437 57.57223 182.412516 140.363841 222.936465C235.330238 586.429153 111.796714 740.736565 111.796714 923.694503c0 18.464537 15.032368 33.443693 33.496905 33.443693 18.464537 0 33.497928-14.979156 33.497928-33.443693 0-183.774537 149.46001-333.343017 333.234547-333.343017 183.77556 0 333.234547 149.568481 333.234547 333.343017 0 18.464537 14.978133 33.443693 33.443693 33.443693 18.519796 0 33.496905-14.979156 33.496905-33.443693C912.20124 740.736565 788.668739 586.429153 620.744191 538.879184zM329.886801 315.942719c0-100.438527 81.70179-182.194552 182.140317-182.194552 100.384291 0 182.086082 81.756025 182.086082 182.194552 0 100.384291-81.702813 182.086082-182.086082 182.086082C411.587568 498.0288 329.886801 416.32701 329.886801 315.942719z"
          ></path>
        </svg>
        <span>联系人</span>
      </div>

      <div
        @click="
          sharedState.QQ.activePage = 3;
          sharedState.QQ.post.forEach(item => (item.read = true));
        "
        id="QQ_moment_nav"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1px;
          position: relative;
        "
      >
        <svg
          viewBox="0 0 1059 1024"
          width="20"
          height="20"
          id="QQ_moment_svg"
          :style="{
            fill: sharedState.QQ.activePage == 3 ? '#019aff' : '#000000',
          }"
        >
          <path
            d="M206.566465 1008.20002c11.278404 7.517627 30.080982 15.035253 45.117545 15.035254 11.281023 0 26.324133-3.75554 37.605156-7.517627l240.646548-127.777391 240.646547 127.777391c11.278404 7.517627 22.558118 7.517627 37.602537 7.517627 15.037872 0 30.075744-3.75554 45.118854-15.035254 22.559427-15.030015 37.598609-45.097903 30.082292-71.402393l-45.124092-278.110282L1037.545084 459.503632c18.799959-18.790793 26.321514-48.85868 18.799959-75.163172-7.516317-26.311038-33.839141-45.103141-60.156726-48.85868L714.181074 290.382568 593.854527 42.338864C582.577432 16.027826 556.254609 0.99912 526.177555 0.99912c-30.080982 0-56.403806 15.028706-67.684829 41.339744l-120.32 248.043704L63.679182 331.723621c-26.316276 3.756849-52.640409 22.548951-60.161965 48.853443-7.516317 26.309729-3.758159 56.376307 18.801269 75.169719l199.285852 199.183713-45.120164 278.106353c-3.758159 30.065269 7.521555 60.133156 30.082291 75.163171zM63.679182 406.886793l274.492235-41.339744 48.878322-7.518936 22.559427-45.097903 116.568389-248.042394 120.318691 248.043703 22.562046 45.097903 48.88225 7.516317 274.485688 41.339744L789.383529 606.074435l-33.845688 33.822117 7.522865 45.103141 45.124092 278.103734-240.651785-127.777391-41.356767-26.311039-45.124093 22.555499-240.646547 131.532931 45.120164-278.103734 7.521555-45.103141-30.082292-33.823427L63.679182 406.888102z"
            p-id="37579"
          ></path>
          <path
            d="M526.176246 692.509463c-131.604951 0-176.725115-127.777391-176.725116-131.53424-3.763396-15.035253 3.758159-30.065269 18.796031-33.828665 15.044419-3.75554 30.080982 3.763396 33.845688 18.793411 0 3.762087 33.839141 93.953964 124.084706 93.953965 90.239018 0 124.078159-93.953964 124.078159-93.953965 3.763396-15.030015 18.801269-22.548951 33.845688-18.793411 15.036563 3.763396 22.558118 22.555499 18.79603 33.828665 0 3.756849-45.120164 131.53555-176.721186 131.535549z"
            p-id="37580"
          ></path>
        </svg>
        <span>动态</span>
        <div
          v-show="sharedState.QQ.postUnread > 0"
          class="new_tips"
          style="
            position: absolute;
            right: -8px;
            top: -8px;
            background-color: red;
            color: white;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            display: flex;
          "
        >
          {{ sharedState.QQ.postUnread }}
        </div>
      </div>
    </div>

    <div
      id="QQ_friend_info"
      style="display: none; background-color: white; height: 100%; width: 100%; padding-top: 50px; padding-left: 10px"
    >
      <span>自定义名称:</span><input type="text" name="" id="setcharname" placeholder="这里输入名称" />
      <br />
      <br />
      <span>自定义头像:</span>
      <input type="file" id="QQ_head_input" />

      <br /><br /><br />
      <button onclick="Setfriendinfo(false)">取消</button>
      <button onclick="Setfriendinfo(true)">确定</button>
    </div>

    <div id="QQ_chat_list" style="width: 100%; height: 100%; padding-top: 0px">
      <!-- <transition name="slide-fade" v-for="(value, key) in sharedState.QQ.chars">
        <chat_page v-show="sharedState.QQ.activeChatId == key" :data-name="key" :value="value" :name="key"></chat_page>
      </transition> -->

      <chat_page
        v-for="(value, key) in sharedState.QQ.chars"
        v-show="sharedState.QQ.activeChatId === key"
        :data-name="key"
        :value="value"
        :name="key"
      />
    </div>
    <transition name="popup">
      <div v-show="sharedState.phone.panel" class="chat-setting-popup">
        <div class="chat-setting-header">
          <span>手机设置</span>
          <svg @click="closeSetting(false)" class="close-setting-btn" viewBox="0 0 1024 1024" width="20" height="20">
            <path
              d="M512 421.490332 331.092592 240.582924C307.952518 217.442849 270.568889 217.442849 247.428814 240.582924 224.288739 263.722999 224.288739 301.106628 247.428814 324.246702L428.336222 505.154112 247.428814 686.061521C224.288739 709.201596 224.288739 746.585225 247.428814 769.7253 270.568889 792.865374 307.952518 792.865374 331.092592 769.7253L512 588.817891 692.907408 769.7253C716.047482 792.865374 753.431111 792.865374 776.571186 769.7253 799.711261 746.585225 799.711261 709.201596 776.571186 686.061521L595.663778 505.154112 776.571186 324.246702C799.711261 301.106628 799.711261 263.722999 776.571186 240.582924 753.431111 217.442849 716.047482 217.442849 692.907408 240.582924L512 421.490332Z"
              fill="#666666"
            ></path>
          </svg>
        </div>
        <div class="chat-setting-content" style="padding-top: 5px; overflow-x: hidden">
          <fieldset
            style="
              border: 1px solid;
              padding: 5px 10px 10px;
              width: 100%;
              display: flex;
              gap: 15px;
              flex-direction: column;
            "
          >
            <legend>颜色设置:</legend>
            <div class="setting-item">
              <span>外框颜色</span>
              <div style="flex: 1">
                <input
                  v-model="sharedState.phone.colorSettings.border"
                  style="width: 100%"
                  type="text"
                  id="bubble-color-input"
                  placeholder="颜色值"
                />
              </div>
              <input v-model="sharedState.phone.colorSettings.border" type="color" class="color-picker" />
            </div>
            <div class="setting-item">
              <span>内框颜色</span>
              <div style="flex: 1">
                <input
                  v-model="sharedState.phone.colorSettings.background"
                  style="width: 100%"
                  type="text"
                  id="text-color-input"
                  placeholder="颜色值"
                />
              </div>
              <input v-model="sharedState.phone.colorSettings.background" type="color" class="color-picker" />
            </div>
            <div class="setting-item">
              <span>侧边按钮</span>
              <div style="flex: 1">
                <input
                  v-model="sharedState.phone.colorSettings.button"
                  style="width: 100%"
                  type="text"
                  id="text-color-input"
                  placeholder="颜色值"
                />
              </div>
              <input v-model="sharedState.phone.colorSettings.button" type="color" class="color-picker" />
            </div>
            <div class="setting-item">
              <span>user气泡</span>
              <div style="flex: 1">
                <input
                  v-model="phone_settings.userBubble"
                  style="width: 100%"
                  type="text"
                  id="text-color-input"
                  placeholder="颜色值"
                />
              </div>
              <input v-model="phone_settings.userBubble" type="color" class="color-picker" />
            </div>
            <div class="setting-item">
              <span>user字体</span>
              <div style="flex: 1">
                <input
                  v-model="phone_settings.userText"
                  style="width: 100%"
                  type="text"
                  id="text-color-input"
                  placeholder="颜色值"
                />
              </div>
              <input v-model="phone_settings.userText" type="color" class="color-picker" />
            </div>
            <div style="font-size: 14px; text-align: center">右边的框点一下可以选颜色</div>
          </fieldset>
          <fieldset
            style="
              border: 1px solid;
              padding: 5px 10px 10px;
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 15px;
            "
          >
            <legend>手机设置:</legend>
            <!-- 宽度高度，logo显示 -->
            <div style="display: flex; width: 100%; align-items: center; gap: 5px">
              <span>刘海图标</span>
              <select class="QQ_chars-form-select" style="flex: 1">
                <option value="不显示">不显示</option>
                <option value="小米">小米</option>
                <option value="华为">华为</option>
              </select>
            </div>
            <div class="setting-item">
              <svg @click="setPhoneSize('width', -10)" style="width: 1.5rem; height: 1.5rem" viewBox="0 0 1024 1024">
                <path
                  d="M603.3 327.5l-246 178c-4.4 3.2-4.4 9.7 0 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"
                  p-id="3334"
                ></path>
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  p-id="3335"
                ></path>
              </svg>
              <span>手机宽度</span>
              <div style="flex: 1">
                <input v-model="sharedState.phone.width.now" style="width: 100%" type="number" />
              </div>
              <svg
                @click="setPhoneSize('width', 10)"
                style="width: 1.5rem; height: 1.5rem; transform: rotate(180deg)"
                viewBox="0 0 1024 1024"
              >
                <path
                  d="M603.3 327.5l-246 178c-4.4 3.2-4.4 9.7 0 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"
                  p-id="3334"
                ></path>
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  p-id="3335"
                ></path>
              </svg>
            </div>
            <div class="setting-item">
              <svg @click="setPhoneSize('height', -10)" style="width: 1.5rem; height: 1.5rem" viewBox="0 0 1024 1024">
                <path
                  d="M603.3 327.5l-246 178c-4.4 3.2-4.4 9.7 0 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"
                  p-id="3334"
                ></path>
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  p-id="3335"
                ></path>
              </svg>
              <span>手机高度</span>
              <div style="flex: 1">
                <input v-model="sharedState.phone.height.now" style="width: 100%" type="number" />
              </div>
              <svg
                @click="setPhoneSize('height', 10)"
                style="width: 1.5rem; height: 1.5rem; transform: rotate(180deg)"
                viewBox="0 0 1024 1024"
              >
                <path
                  d="M603.3 327.5l-246 178c-4.4 3.2-4.4 9.7 0 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"
                  p-id="3334"
                ></path>
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                  p-id="3335"
                ></path>
              </svg>
            </div>
          </fieldset>
          <fieldset style="border: 1px solid; padding: 5px 10px 10px; width: 100%">
            <legend>有新消息时:</legend>
            <div style="display: flex; align-items: center; gap: 5px">
              <span>有格式自动弹出</span>
              <input v-model="phone_settings.autoShow" checked="" type="checkbox" style="width: 1rem; height: 1rem" />
            </div>
            <div style="display: flex; align-items: center; margin-top: 5px; gap: 5px">
              <span>无格式自动隐藏</span>
              <input v-model="phone_settings.autoHide" checked="" type="checkbox" style="width: 1rem; height: 1rem" />
            </div>
          </fieldset>
          <fieldset style="border: 1px solid; padding: 5px 10px 10px; width: 100%">
            <legend>点击发送按钮时:</legend>
            <div style="display: flex; align-items: start">
              <span>直接发送消息</span>
              <input type="radio" v-model="phone_settings.sendModel" value="normal" />
            </div>
            <div style="display: flex; align-items: start; margin-top: 5px">
              <span>把消息添加到酒馆输入框</span>
              <input type="radio" v-model="phone_settings.sendModel" value="尾附" />
            </div>
          </fieldset>
        </div>
        <div class="chat-setting-footer">
          <!-- <button @click="restoreColor()" id="randomcolor-setting-btn" style="background-color: #919bec; color: white">
          默认
        </button> -->
          <button @click="closeSetting(true)" id="save-setting-btn">保存</button>
          <button @click="closeSetting(false)" id="cancel-setting-btn">取消</button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-show="sharedState.QQ.panel || sharedState.phone.panel" class="popup-overlay"></div>
    </transition>
    <transition name="popup">
      <div v-show="sharedState.QQ.panel" class="QQ_chars-panel">
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <div style="text-align: center; font-size: 24px">角色管理面板</div>
          <svg
            @click="sharedState.QQ.panel = false"
            style="margin-left: auto"
            class="close-setting-btn"
            viewBox="0 0 1024 1024"
            width="24"
            height="24"
          >
            <path
              d="M512 421.490332 331.092592 240.582924C307.952518 217.442849 270.568889 217.442849 247.428814 240.582924 224.288739 263.722999 224.288739 301.106628 247.428814 324.246702L428.336222 505.154112 247.428814 686.061521C224.288739 709.201596 224.288739 746.585225 247.428814 769.7253 270.568889 792.865374 307.952518 792.865374 331.092592 769.7253L512 588.817891 692.907408 769.7253C716.047482 792.865374 753.431111 792.865374 776.571186 769.7253 799.711261 746.585225 799.711261 709.201596 776.571186 686.061521L595.663778 505.154112 776.571186 324.246702C799.711261 301.106628 799.711261 263.722999 776.571186 240.582924 753.431111 217.442849 716.047482 217.442849 692.907408 240.582924L512 421.490332Z"
              fill="#666666"
            ></path>
          </svg>
        </div>

        <div class="QQ_chars-role-list" style="margin-bottom: 20px">
          <!-- 角色列表将在这里动态生成 -->
          <div v-if="chars.length == 0" class="QQ_chars-empty-state">
            <svg
              style="margin: auto"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.35418C12.7329 3.52375 13.8053 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C13.8053 11 12.7329 10.4762 12 9.64582M15 21H3V20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20V21ZM15 21H21V20C21 16.6863 18.3137 14 15 14C13.9071 14 12.8826 14.2922 12 14.8027"
                stroke="#888"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="QQ_chars-empty-text">暂无角色，请添加新角色</p>
          </div>
          <!-- v-for="(value, key) in sharedState.QQ.chars" -->
          <div v-for="value of chars" class="QQ_chars-role-item">
            <div class="QQ_chars-role-info">
              <div class="QQ_chars-role-name" title="${role.name}">{{ value.name }}</div>
              <div :class="`QQ_chars-role-type ${value.class}`">{{ value.showtype }}</div>
            </div>
            <button @click="removeChar(value)" class="QQ_chars-delete-btn">删除</button>
          </div>
        </div>

        <div class="QQ_chars-add-role-form">
          <h3 class="QQ_chars-form-title">添加新角色</h3>
          <div class="QQ_chars-form-row">
            <label class="QQ_chars-form-label" for="roleName">角色名称:</label>
            <div style="flex: 1 1 0%">
              <input
                v-model="addCharInfo.name"
                class="QQ_chars-form-input"
                type="text"
                id="roleName"
                placeholder="输入角色名称"
              />
            </div>
          </div>
          <div class="QQ_chars-form-row">
            <label class="QQ_chars-form-label" for="roleType">角色类型:</label>
            <div style="flex: 1 1 0%">
              <select v-model="addCharInfo.type" class="QQ_chars-form-select">
                <option value="friend">好友</option>
                <option value="Group">群聊</option>
                <option value="npc">NPC</option>
              </select>
            </div>
          </div>
          <button @click="addChar" class="QQ_chars-submit-btn" id="addRoleBtn">添加角色</button>
        </div>

        <div style="font-size: 12px; color: gray; margin-top: 10px">修改角色后退出聊天重进,让手机重新加载</div>
        <div style="font-size: 12px; color: gray; margin-top: 3px">角色其他信息点进聊天框右上角修改</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { sharedState, MyINI, IndexedDB } from '../shared-state';
import chat_page from './chat_page.vue';
import home_chars from './home_chars.vue';
import post from './post.vue';
const chars = computed(() => {
  let list = [];
  const Sections = sharedState.QQ.charini.getAllSections();
  for (const char in sharedState.QQ.chars) {
    if (!Sections.includes(char)) {
      continue;
    }
    const obj = {};
    obj.id = char;
    obj.name = sharedState.QQ.chars[char].name;
    const chartype = sharedState.QQ.charini.readValue(char, '类型');
    if (chartype == '群聊') {
      obj.chartype = 'Group';
      obj.showtype = '群聊';
      obj.class = 'QQ_chars-type-group';
    } else if (chartype.toLowerCase() == 'npc') {
      obj.chartype = 'npc';
      obj.showtype = 'npc';
      obj.class = 'QQ_chars-type-npc';
    } else {
      obj.chartype = 'friend';
      obj.showtype = '好友';
      obj.class = 'QQ_chars-type-friend';
    }
    list.push(obj);
  }
  return list;
});
const addCharInfo = ref({
  name: '',
  type: 'friend',
});
const backupColor = JSON.parse(JSON.stringify(sharedState.phone.colorSettings));
const phone_settings = ref({
  background: sharedState.phone.colorSettings.background,
  border: sharedState.phone.colorSettings.border,
  button: sharedState.phone.colorSettings.button,
  autoShow: sharedState.phone.autoShow,
  autoHide: sharedState.phone.autoHide,
  userBubble: sharedState.QQ.default.bubble,
  userText: sharedState.QQ.default.text,
  sendModel: sharedState.phone.sendModel,
});

const goHome = () => {
  sharedState.QQ.panel = false;
  sharedState.phone.panel = false;
  sharedState.phone.activeApp = 'Home';
};

function removeChar(char) {
  const result = confirm(`确定要删除角色：${char.name}吗`);
  if (!result) {
    return;
  }
  console.log(`删除角色:${char.id}`);
  sharedState.QQ.charini.removeSection(char.id);
  if (char.id in sharedState.QQ.chars) {
    delete sharedState.QQ.chars[char.id];
  }
  sharedState.QQ.saveChars();
}

function addChar() {
  if (!addCharInfo.value.name) {
    return;
  }
  let id = addCharInfo.value.name;
  if (addCharInfo.value.type == 'Group') {
    const Sections = sharedState.QQ.charini.getAllSections();
    while (true) {
      id = '';
      for (let i = 0; i < 6; i++) {
        id += Math.floor(Math.random() * 10);
      }
      if (!Sections.includes(id)) {
        break;
      }
    }
  }

  if (addCharInfo.value.type == 'Group' || addCharInfo.value.type == 'npc') {
    sharedState.QQ.charini.writeValue(id, '类型', addCharInfo.value.type == 'Group' ? '群聊' : 'npc');
    if (addCharInfo.value.type == 'Group') {
      sharedState.QQ.charini.writeValue(id, '群名', addCharInfo.value.name);
    }
  } else {
    sharedState.QQ.charini.writeValue(id, '类型', '好友');
  }

  sharedState.QQ.chars[id] = {
    name: addCharInfo.value.name,
    chartype: addCharInfo.value.type,
    head: '',
    background: '',
    bubble: '',
    text: '',
  };

  addCharInfo.value.name = '';
  sharedState.QQ.saveChars();
}

async function closeSetting(save) {
  sharedState.phone.panel = false;
  if (!save) {
    sharedState.phone.colorSettings = JSON.parse(JSON.stringify(backupColor));
    phone_settings.value.autoHide = sharedState.phone.autoHide;
    phone_settings.value.autoShow = sharedState.phone.autoShow;
    phone_settings.value.userBubble = sharedState.QQ.default.bubble;
    phone_settings.value.userText = sharedState.QQ.default.text;

    phone_settings.value.sendModel = sharedState.phone.sendModel;
    return;
  }

  sharedState.phone.autoHide = phone_settings.value.autoHide;
  sharedState.phone.autoShow = phone_settings.value.autoShow;
  sharedState.QQ.default.bubble = phone_settings.value.userBubble;
  sharedState.QQ.default.text = phone_settings.value.userText;
  sharedState.phone.sendModel = phone_settings.value.sendModel;
  // 保存到世界书
  try {
    const entry = sharedState.ST.getEntry(['手机-基本设置'], true);
    if (!entry) {
      alert('手机-基本设置条目不存在');
      return;
    }
    const ini = new MyINI();
    ini.loadText(entry.content);
    ini.writeValue('基本设置', '外框颜色', sharedState.phone.colorSettings.border);
    ini.writeValue('基本设置', '内框颜色', sharedState.phone.colorSettings.background);
    ini.writeValue('基本设置', '侧边按钮', sharedState.phone.colorSettings.button);
    ini.writeValue('基本设置', '自动显示', sharedState.phone.autoShow);
    ini.writeValue('基本设置', '自动隐藏', sharedState.phone.autoHide);
    ini.writeValue('基本设置', '气泡颜色', sharedState.QQ.default.bubble);
    ini.writeValue('基本设置', '字体颜色', sharedState.QQ.default.text);
    ini.writeValue('基本设置', '发送模式', sharedState.phone.sendModel);
    console.log(`${ini.getAllText()}`);
    await setLorebookEntries(sharedState.ST.worldName, [{ uid: entry.uid, content: ini.getAllText() }]);
  } catch (e) {
    console.error(`基本设置保存到世界书失败!${e}`);
  }

  // 保存手机尺寸
  IndexedDB.setData('width', sharedState.phone.width.now);
  IndexedDB.setData('height', sharedState.phone.height.now);
}

function setPhoneSize(sizeType, change) {
  const minwidth = sharedState.phone.width.min;
  const maxwidth = sharedState.phone.width.max;
  const minheight = sharedState.phone.height.min;
  const maxheight = sharedState.phone.height.max;

  if (sizeType == 'width') {
    if (sharedState.phone.width.now + change < minwidth) {
      sharedState.phone.width.now = minwidth;
    } else if (sharedState.phone.width.now + change > maxwidth) {
      sharedState.phone.width.now = maxwidth;
    } else {
      sharedState.phone.width.now += change;
    }
  } else if (sizeType == 'height') {
    if (sharedState.phone.height.now + change < minheight) {
      sharedState.phone.height.now = minheight;
    } else if (sharedState.phone.height.now + change > maxheight) {
      sharedState.phone.height.now = maxheight;
    } else {
      sharedState.phone.height.now += change;
    }
  }
}

// function restoreColor() {}
</script>

<!-- 弹出框动画 -->
<style scoped>
/* 遮罩层 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 弹框动画 */
.popup-enter-active,
.popup-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translate(-50%, -46%) scale(0.96); /* 轻缩小+上移 */
}
.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
</style>

<style src="./chat.css"></style>

<style>
.QQ_chars-panel {
  /* max-width: 300px; */
  width: 80%;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  max-height: 80%;
  height: auto;
  border: 1px solid #eaeaea;
}

.QQ_chars-title {
  text-align: center;
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 18px;
}

.QQ_chars-role-list {
  margin-bottom: 20px;
  overflow-y: auto;
  max-height: 50%;
  height: auto;
  padding: 0 10px;
}

.QQ_chars-role-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.QQ_chars-role-item:hover {
  background-color: #f9f9f9;
}

.QQ_chars-role-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.QQ_chars-role-name {
  font-weight: 500;
  font-size: 14px;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.QQ_chars-role-type {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
}

.QQ_chars-type-friend {
  background-color: #4caf50;
}

.QQ_chars-type-group {
  background-color: #2196f3;
}

.QQ_chars-type-npc {
  background-color: #ff9800;
}

.QQ_chars-type-select {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  cursor: pointer;
}

.QQ_chars-delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  transition: background-color 0.2s;
  height: 26px;
}

.QQ_chars-delete-btn:hover {
  background-color: #d32f2f;
}

.QQ_chars-add-role-form {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #eaeaea;
}

.QQ_chars-form-title {
  margin-bottom: 10px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.QQ_chars-form-row {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  justify-content: space-between;
}

.QQ_chars-form-label {
  font-size: 12px;
  width: 70px;
}

.QQ_chars-form-input,
.QQ_chars-form-select {
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  width: 100%;
}

.QQ_chars-form-input:focus,
.QQ_chars-form-select:focus {
  outline: none;
  border-color: #2196f3;
}

.QQ_chars-submit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 5px;
  width: 100%;
  transition: background-color 0.2s;
}

.QQ_chars-submit-btn:hover {
  background-color: #45a049;
}

.QQ_chars-empty-state {
  text-align: center;
  padding: 20px 0;
  color: #888;
}

.QQ_chars-empty-text {
  margin-top: 5px;
  font-size: 12px;
}
</style>
