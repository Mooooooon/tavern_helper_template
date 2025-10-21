<template>
  <transition name="popup">
    <div
      v-show="sharedState.phone.show"
      :class="`card${!sharedState.ST.isMobile ? ' card-pc' : ''}`"
      id="baibai_phone"
      ref="cardRef"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @touchend="handleTouchEnd($event, false)"
    >
      <div class="btn1"></div>
      <div class="btn2"></div>
      <div class="btn3"></div>
      <div class="btn4"></div>
      <div class="dinbu">
        <span id="time" style="font-size: 12px">{{ sharedState.phone.time }}</span>
        <div style="display: flex; align-items: center; justify-self: end; gap: 2px">
          <svg viewBox="0 0 1024 1024" width="16" height="15">
            <path
              d="M926.634667 294.912a32 32 0 1 1-39.936 50.005333C780.512 260.128 649.824 213.333333 512.053333 213.333333c-137.813333 0-268.544 46.826667-374.752 131.669334a32 32 0 1 1-39.936-50.005334C214.784 201.194667 359.562667 149.333333 512.053333 149.333333c152.437333 0 297.173333 51.818667 414.581334 145.578667z m-235.413334 298.133333a32 32 0 0 1-38.442666 51.178667A233.418667 233.418667 0 0 0 512.021333 597.333333c-51.541333 0-100.48 16.629333-140.8 46.912a32 32 0 1 1-38.442666-51.157333A297.408 297.408 0 0 1 512.021333 533.333333c65.504 0 127.893333 21.184 179.2 59.722667z m128-149.344a32 32 0 0 1-38.442666 51.168C703.829333 437.066667 610.378667 405.333333 512.032 405.333333c-98.368 0-191.850667 31.754667-268.8 89.578667a32 32 0 1 1-38.453333-51.157333C292.736 377.664 399.669333 341.333333 512.032 341.333333c112.32 0 219.242667 36.309333 307.189333 102.368zM512 853.333333a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
              fill="currentColor"
            ></path>
          </svg>
          <span style="font-size: 12px">78%</span>
          <svg viewBox="0 0 1024 1024" width="15" height="15" style="justify-self: end; margin-right: 13px">
            <path
              d="M984.2 434.8c-5-2.9-8.2-8.2-8.2-13.9v-99.3c0-53.6-43.9-97.5-97.5-97.5h-781C43.9 224 0 267.9 0 321.5v380.9C0 756.1 43.9 800 97.5 800h780.9c53.6 0 97.5-43.9 97.5-97.5v-99.3c0-5.8 3.2-11 8.2-13.9 23.8-13.9 39.8-39.7 39.8-69.2v-16c0.1-29.6-15.9-55.5-39.7-69.3zM912 702.5c0 12-6.2 19.9-9.9 23.6-3.7 3.7-11.7 9.9-23.6 9.9h-781c-11.9 0-19.9-6.2-23.6-9.9-3.7-3.7-9.9-11.7-9.9-23.6v-381c0-11.9 6.2-19.9 9.9-23.6 3.7-3.7 11.7-9.9 23.6-9.9h780.9c11.9 0 19.9 6.2 23.6 9.9 3.7 3.7 9.9 11.7 9.9 23.6v381z"
              p-id="4287"
              fill="currentColor"
            ></path>
            <path
              d="M736 344v336c0 8.8-7.2 16-16 16H112c-8.8 0-16-7.2-16-16V344c0-8.8 7.2-16 16-16h608c8.8 0 16 7.2 16 16z"
              p-id="4288"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <div class="card-int" style="background-color: white">
        <Home v-if="sharedState.phone.activeApp === 'Home'" />
        <div v-else id="App_Page" style="height: 100%">
          <div class="twitter" id="App_twitter" style="display: none">
            <div class="mimictwitter">
              <div style="margin-right: 8px; margin-top: 10px">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center">
                  <div
                    style="border-radius: 50%; width: 32px; height: 32px; margin-left: 7px"
                    class="twitter-close-btn user_avatar"
                  ></div>
                  <svg viewBox="0 0 24 24" style="width: 24.73px; height: 54px; justify-self: center">
                    <g>
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      ></path>
                    </g>
                  </svg>
                  <svg style="margin-left: auto; width: 24px; height: 24px" viewBox="0 0 1024 1024" aria-hidden="true">
                    <g>
                      <path
                        d="M596.992 512q0 34.016-24 59.008-12 12-27.488 18.496T512.992 596q-34.016 0-59.008-24.992-4.992-4.992-8.51199999-10.016t-6.49600001-11.008-4.992-12.512-3.48799999-12.992-1.50400001-12.512q0-35.00800001 24.992-59.488t59.488-24.512 59.488 24q7.008 8 12.992 17.504t8.512 20.512T596.96 512z m0 332q0 35.00800001-24 59.008-8 8-17.504 13.504t-20.512 8.512-22.016 3.008q-34.016 0-59.008-24.992-6.016-4.992-10.496-12t-7.488-14.496-4.992-16-2.016-16.512q0-35.00800001 24.992-59.488t59.488-24.51199999 59.488 24.99199999q11.008 11.008 17.504 27.008t6.496 32z m0-664.992q0 35.00800001-24 59.008-8 8-17.504 13.504t-20.512 8.512-22.016 3.00800001q-34.016 0-59.008-24.51200001T428.96 179.04000001t24.992-59.00800001q12-12 27.488-18.496t31.488-6.496q35.00800001 0 60 24.992 11.008 11.008 17.504 27.008t6.496 32z"
                        fill="#000000"
                        p-id="1477"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div style="margin-top: 13px"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; align-items: center; justify-items: center">
                  <span style="color: rgb(95, 111, 123)">为你推荐</span>
                  <span><strong>正在关注</strong></span>
                </div>
                <div
                  style="
                    margin-top: 8px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    justify-items: center;
                  "
                >
                  <div></div>
                  <div style="background-color: rgb(29, 155, 240); width: 100%; height: 4px; border-radius: 50px"></div>
                </div>
                <div style="width: 100%; height: 1px; background-color: rgb(240, 244, 245); margin-top: 2px"></div>
              </div>

              <div class="twitter-content">
                <!-- <div class="twitter_moment">
                <img class="twitterhead" src="http://sharkpan.xyz/f/NMuv/QQ%E5%9B%BE%E7%89%8720241227022547.jpg"
                  alt="加载失败" />
                <div style="width: 100%; margin-left: 3px">
                  <span><strong>这是名字</strong></span>
                  <span style="color: rgb(95, 111, 123); font-size: 14px">· 1天</span>
                  <div style="width: 100%; height: 6px"></div>
                  <span>123123</span>
                  <img src="http://sharkpan.xyz/f/z0WU5/mmexport1736971020657.gif" alt="加载失败"
                    style="width: 100%; margin-top: 5px" />
                </div>
                <svg style="width: 18px; height: 18px; justify-self: end" viewBox="0 0 1024 1024">
                  <g>
                    <path
                      d="M596.992 512q0 34.016-24 59.008-12 12-27.488 18.496T512.992 596q-34.016 0-59.008-24.992-4.992-4.992-8.51199999-10.016t-6.49600001-11.008-4.992-12.512-3.48799999-12.992-1.50400001-12.512q0-35.00800001 24.992-59.488t59.488-24.512 59.488 24q7.008 8 12.992 17.504t8.512 20.512T596.96 512z m0 332q0 35.00800001-24 59.008-8 8-17.504 13.504t-20.512 8.512-22.016 3.008q-34.016 0-59.008-24.992-6.016-4.992-10.496-12t-7.488-14.496-4.992-16-2.016-16.512q0-35.00800001 24.992-59.488t59.488-24.51199999 59.488 24.99199999q11.008 11.008 17.504 27.008t6.496 32z m0-664.992q0 35.00800001-24 59.008-8 8-17.504 13.504t-20.512 8.512-22.016 3.00800001q-34.016 0-59.008-24.51200001T428.96 179.04000001t24.992-59.00800001q12-12 27.488-18.496t31.488-6.496q35.00800001 0 60 24.992 11.008 11.008 17.504 27.008t6.496 32z"
                      fill="#8a8a8a" p-id="1477"></path>
                  </g>
                </svg>
                <div></div>
                <div
                  style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; margin-top: 8px">
                  <div style="display: flex; align-items: center">
                    <svg viewBox="0 0 24 24" class="interactsvg">
                      <g>
                        <path
                          d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z">
                        </path>
                      </g>
                    </svg>
                    <span style="font-size: 13px; margin-left: 2px">39</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <svg viewBox="0 0 24 24" class="interactsvg">
                      <g>
                        <path
                          d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z">
                        </path>
                      </g>
                    </svg>
                    <span style="font-size: 13px; margin-left: 2px">25</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <svg viewBox="0 0 24 24" class="interactsvg">
                      <g>
                        <path
                          d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z">
                        </path>
                      </g>
                    </svg>
                    <span style="font-size: 13px; margin-left: 2px">2761</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <svg viewBox="0 0 24 24" class="interactsvg">
                      <g>
                        <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z">
                        </path>
                      </g>
                    </svg>
                    <span style="font-size: 13px; margin-left: 2px">1.5万</span>
                  </div>
                </div>
              </div> -->
                <hr />
              </div>
            </div>
          </div>
          <transition name="slide-fade">
            <div
              v-show="sharedState.phone.activeApp == 'QQ'"
              id="QQ_div"
              style="background-color: #eff3ff; width: 100%; height: 100%; box-sizing: border-box; position: relative"
            >
              <QQ></QQ>
            </div>
          </transition>

          <div
            id="RedNote_div"
            v-show="sharedState.phone.activeApp == 'RedNote'"
            style="background-color: #eff3ff; width: 100%; height: 100%"
          >
            <RedNote></RedNote>
          </div>

          <div class="discord" id="App_discord" style="display: none; width: 100%; height: 100%">
            <div class="discord-homepage" style="width: 100%; height: 100%">
              <div class="discord-top">
                <svg
                  t="1744127791511"
                  class="discord-top-return"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3402"
                  width="28"
                  height="28"
                >
                  <path
                    d="M440.070244 831.562927c11.813463 0 23.601951-4.49561 32.593171-13.486829a45.980098 45.980098 0 0 0 0-65.161366l-198.730927-198.730927 589.674146 0.499512c24.001561 0 43.507512-19.431024 43.40761-43.40761 0-24.101463-19.480976-43.63239-43.507512-43.63239l-592.221659-0.574439 201.378342-201.378341a45.980098 45.980098 0 0 0 0-65.161366 45.980098 45.980098 0 0 0-65.186342 0L131.29678 476.734439a45.955122 45.955122 0 0 0-13.53678 33.16761v0.574439c0 13.361951 5.994146 25.300293 15.409951 33.292488l274.307122 274.332097c8.99122 8.966244 20.804683 13.461854 32.593171 13.461854z"
                    p-id="3403"
                    fill="#505058"
                  ></path>
                </svg>
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  style="margin-left: 15px; margin-right: 10px"
                >
                  <path
                    fill="#313237"
                    fill-rule="evenodd"
                    d="M18.09 1.63c.4-.7 1.43-.7 1.82 0l3.96 6.9c.38.66-.12 1.47-.91 1.47h-7.92c-.79 0-1.3-.81-.91-1.48l3.96-6.9Zm.46 1.87h.9c.3 0 .52.26.5.55l-.22 2.02c-.01.16-.17.26-.33.23a1.92 1.92 0 0 0-.8 0c-.16.03-.32-.07-.33-.23l-.21-2.02a.5.5 0 0 1 .5-.55ZM19 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clip-rule="evenodd"
                    class=""
                  ></path>
                  <path
                    fill="#313237"
                    d="M14.8 3.34a.48.48 0 0 0-.24-.69A9.94 9.94 0 0 0 11 2c-4.97 0-9 3.58-9 8 0 1.5.47 2.91 1.28 4.11.14.21.12.49-.06.67l-1.51 1.51A1 1 0 0 0 2.4 18h5.1a.5.5 0 0 0 .49-.5c0-2.86 1.62-5.3 3.97-6.56.28-.15.38-.51.25-.8a2.86 2.86 0 0 1 .18-2.61l2.4-4.19ZM18.91 12.98a5.45 5.45 0 0 1 2.18 6.2c-.1.33-.09.68.1.96l.83 1.32a1 1 0 0 1-.84 1.54h-5.5A5.6 5.6 0 0 1 10 17.5a5.6 5.6 0 0 1 5.68-5.5c1.2 0 2.32.36 3.23.98Z"
                    class=""
                  ></path>
                </svg>
                <div class="discord-top-title"><strong>类脑ΟΔΥΣΣΕΙΑ</strong></div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #ebebeb;
                    border-radius: 50%;
                    height: 32px;
                    width: 32px;
                    margin-left: auto;
                    margin-right: 10px;
                  "
                >
                  <svg viewBox="0 0 1024 1024" width="16" height="16">
                    <path
                      d="M991.418182 972.8L791.272727 772.654545c79.127273-83.781818 130.327273-195.490909 130.327273-316.50909 0-251.345455-200.145455-451.490909-446.836364-451.49091C232.727273 0 32.581818 204.8 32.581818 451.490909s200.145455 451.490909 446.836364 451.490909c97.745455 0 190.836364-32.581818 265.309091-88.436363l200.145454 204.8 46.545455-46.545455zM102.4 451.490909c0-209.454545 167.563636-381.672727 377.018182-381.672727s377.018182 172.218182 377.018182 381.672727-172.218182 386.327273-381.672728 386.327273c-204.8 0-372.363636-172.218182-372.363636-386.327273z"
                      fill="#55565c"
                      p-id="12001"
                    ></path>
                  </svg>
                </div>
              </div>

              <div style="width: 100%; height: 1px; background-color: #dcdcdc"></div>
              <div style="width: 100%; height: 1px; background-color: #d8d9db"></div>

              <div class="discord-top-button">
                <div class="sortbutton">
                  <svg
                    aria-hidden="true"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#515256"
                      d="M16.3 21.7a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0-1.4-1.4L18 18.58V3a1 1 0 1 0-2 0v15.59l-2.3-2.3a1 1 0 0 0-1.4 1.42l4 4ZM6.3 2.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L8 5.42V21a1 1 0 1 1-2 0V5.41l-2.3 2.3a1 1 0 0 1-1.4-1.42l4-4Z"
                      class=""
                    ></path>
                  </svg>
                  <div style="font-size: 14px; color: #515256">排序 & 查看</div>
                  <svg
                    aria-hidden="true"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#515256"
                      d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
                      class=""
                    ></path>
                  </svg>
                </div>

                <div class="tagbutton">
                  <div style="font-size: 14px; color: #515256">标签</div>
                  <svg
                    aria-hidden="true"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#515256"
                      d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
                      class=""
                    ></path>
                  </svg>
                </div>
              </div>

              <div style="width: 100%; height: 1px; background-color: #dcdcdc"></div>
              <div style="width: 100%; height: 1px; background-color: #d8d9db"></div>
              <div class="discord-cardlist">
                <div class="discord-cardget">
                  <span>查看帖子</span>
                </div>
              </div>
            </div>
            <div class="discord-thread-list" style="width: 100%; height: 100%; display: none"></div>
          </div>
        </div>
      </div>
      <div
        @dblclick="sharedState.phone.show = !sharedState.phone.show"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @touchend="handleTouchEnd($event, true)"
        @click="console.log(JSON.stringify(sharedState.QQ.chars))"
        class="top"
        ref="topRef"
        style="display: flex; align-items: center; justify-content: center"
      >
        <svg
          t="1735485675807"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9713"
          width="16"
          height="16"
          style="display: none"
        >
          <path
            d="M716.8 805.823147 716.8 384.709973c0-95.68256-77.544107-173.2608-173.216427-173.2608L56.664747 211.449173c-3.754667 0-6.795947 3.024213-6.795947 6.741333L49.8688 805.819733c0 3.71712 3.04128 6.72768 6.795947 6.72768l130.061653 0c3.754667 0 6.792533-3.027627 6.792533-6.765227L193.518933 344.562347c0-3.744427 3.04128-6.782293 6.795947-6.782293l279.68512 0c52.52096 0 95.112533 42.571093 95.112533 95.09888l0 372.8896c0 3.741013 3.037867 6.761813 6.772053 6.761813l128.146773 0c3.72736 0 6.772053-3.017387 6.772053-6.72768M454.15424 805.778773c0 3.744427-3.01056 6.76864-6.76864 6.76864L317.354667 812.547413c-3.754667 0-6.795947-3.027627-6.795947-6.76864L310.55872 452.348587c0-3.741013 3.04128-6.77888 6.795947-6.77888l130.030933 0c3.75808 0 6.76864 3.037867 6.76864 6.77888l0 353.447253L454.15424 805.778773zM974.134613 805.778773c0 3.744427-3.044693 6.76864-6.79936 6.76864l-130.000213 0c-3.764907 0-6.826667-3.027627-6.826667-6.76864L830.508373 218.251947c0-3.75808 3.06176-6.792533 6.826667-6.792533l130.000213 0c3.75808 0 6.79936 3.034453 6.79936 6.792533L974.134613 805.778773z"
            fill="#ffffff"
            p-id="9714"
          ></path>
        </svg>
      </div>
    </div>
  </transition>
</template>

<script setup>
import QQ from './QQ/QQ.vue';
import RedNote from './RedNote/RedNote.vue';
import Home from './Home/Home.vue';
import { sharedState } from './shared-state';
console.log(`index.vue取到的user头像:${sharedState.ST.userHead}`);
const user_avatar = computed(() => {
  return `url('${sharedState.ST.userHead}')`;
});

// 新增: 获取 .card 的 ref
const cardRef = ref(null);
const topRef = ref(null);

// 新增: 拖动相关变量
let isDragging = false;
let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;
let isTouchEvent = false; // 用于区分 touch 或 mouse
let hasMoved = false; // 是否真正移动（超过阈值）

// 新增: 双击检测变量（仅触屏）
let lastTapTime = 0;
const doubleTapDelay = 300; // 双击间隔阈值（ms）
const dragThreshold = 5; // 拖动最小距离阈值（px）

// 开始拖动（兼容 touchstart 和 mousedown）
const startDrag = e => {
  if (e.target != cardRef.value && e.target != topRef.value) {
    return;
  }
  if (!cardRef.value) return; // 确保 ref 已就绪
  e.preventDefault();
  console.log(`开始拖动`);
  isDragging = true;
  hasMoved = false; // 重置移动标志
  isTouchEvent = e.type === 'touchstart'; // 判断事件类型

  // 根据事件类型获取起始坐标
  if (isTouchEvent && e.touches.length > 0) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    startX = e.clientX;
    startY = e.clientY;
  }

  initialLeft = cardRef.value.offsetLeft; // 初始 left
  initialTop = cardRef.value.offsetTop; // 初始 top

  // 使用 jQuery 绑定全局 move 和 end 事件（兼容环境限制）
  if (isTouchEvent) {
    $('body').on('touchmove', onDrag);
    // 注意: touchend 绑定到 @touchend，无需在这里绑定
  } else {
    $('body').on('mousemove', onDrag);
    $('body').on('mouseup', stopDrag);
  }

  e.preventDefault(); // 防止默认行为
};

// 拖动中（兼容 touchmove 和 mousemove）
const onDrag = e => {
  console.log(`鼠标/触屏拖动中`);
  if (!isDragging) return;

  let currentX, currentY;
  if (isTouchEvent && e.touches.length > 0) {
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  } else {
    currentX = e.clientX;
    currentY = e.clientY;
  }

  const dx = currentX - startX; // X 偏移
  const dy = currentY - startY; // Y 偏移

  // 如果偏移超过阈值，才视为真正拖动
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
    hasMoved = true;
    cardRef.value.style.left = `${initialLeft + dx}px`;
    cardRef.value.style.top = `${initialTop + dy}px`;
  }

  e.preventDefault(); // 防止默认行为
};

// 停止拖动（仅用于 mouseup）
const stopDrag = () => {
  console.log(`停止拖动 (鼠标)`);
  isDragging = false;
  hasMoved = false;

  $('body').off('mousemove', onDrag);
  $('body').off('mouseup', stopDrag);
};

// 新增: 处理触屏结束（整合双击和拖动停止）
const handleTouchEnd = (e, showChange = false) => {
  console.log(`触屏结束,${showChange}`);
  isDragging = false;

  // 移除 touchmove 监听
  $('body').off('touchmove', onDrag);

  if (!hasMoved) {
    // 如果没有真正移动，检查双击
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - lastTapTime;

    if (tapInterval < doubleTapDelay && tapInterval > 0 && showChange) {
      // 双击检测到，触发隐藏逻辑
      sharedState.phone.show = !sharedState.phone.show;
      e.preventDefault(); // 防止默认双击行为（如缩放）
    }

    lastTapTime = currentTime; // 更新上次 tap 时间
  }

  hasMoved = false; // 重置移动标志
};

const bgColor = computed(() => {
  return sharedState.phone.colorSettings.background || '#1b1717';
});
const borderColor = computed(() => {
  let color = sharedState.phone.colorSettings.border || '#810000';
  return `2px solid ${color}`;
});
const buttonColor = computed(() => {
  let color = sharedState.phone.colorSettings.button || '#ce1212';
  return color;
});

const card_width = computed(() => {
  if (!sharedState.phone.width.now || !Number(sharedState.phone.width.now)) {
    return '200px';
  } else if (sharedState.phone.width.now > sharedState.phone.width.max) {
    return `${sharedState.phone.width.max}px`;
  } else if (sharedState.phone.width.now < sharedState.phone.width.min) {
    return `${sharedState.phone.width.min}px`;
  } else {
    return `${sharedState.phone.width.now}px`;
  }
});

const card_height = computed(() => {
  if (!sharedState.phone.height.now || !Number(sharedState.phone.height.now)) {
    return `${sharedState.phone.height.min}px`;
  } else if (sharedState.phone.height.now > sharedState.phone.height.max) {
    return `${sharedState.phone.height.max}px`;
  } else if (sharedState.phone.height.now < sharedState.phone.height.min) {
    return `${sharedState.phone.height.min}px`;
  } else {
    return `${sharedState.phone.height.now}px`;
  }
});
</script>

<style>
@import './index.css';
.card {
  background-color: v-bind(bgColor);
  border: v-bind(borderColor);
  height: v-bind(card_height);
  width: v-bind(card_width);
  min-width: v-bind(card_width);
  min-height: v-bind(card_height);
  letter-spacing: 1px;
  line-height: 1.4;
}
.top {
  background-color: v-bind(bgColor);
  touch-action: none;
}
.btn1,
.btn2,
.btn3 {
  background-color: v-bind(buttonColor);
}

.user_avatar {
  background-image: v-bind(user_avatar);
}
/* .card-pc {
  width: min(350px, 95vw, calc(70vh / 2));
  height: auto;
  aspect-ratio: 1 / 2;
  max-height: 70vh;
  max-width: min(350px, 95%);
} */
</style>

<!-- 滑动出入 -->
<style scoped>
/* 进入的起始状态 */
:deep(.slide-fade-enter-from) {
  transform: translateX(100%);
  opacity: 0;
}
/* 进入的结束状态 */
:deep(.slide-fade-enter-to) {
  transform: translateX(0);
  opacity: 1;
}
/* 进入和离开时的过渡 */
:deep(.slide-fade-enter-active),
:deep(.slide-fade-leave-active) {
  transition: all 0.2s ease;
}

/* 关键：让正在离开的元素保持绝对定位，避免被新元素挤/盖 */
:deep(.slide-fade-leave-active) {
  position: absolute;
  inset: 0;
}

/* 离开时的起始状态 */
:deep(.slide-fade-leave-from) {
  transform: translateX(0);
  opacity: 1;
}
/* 离开时的结束状态 */
:deep(.slide-fade-leave-to) {
  transform: translateX(100%);
  opacity: 0;
}

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
