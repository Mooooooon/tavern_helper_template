<template>
  <div class="rednote-homepage" v-show="!sharedState.RedNote.activePost || sharedState.RedNote.post.length == 0">
    <div class="rednote-homepage-top">
      <div
        @click="sharedState.phone.activeApp = 'QQ'"
        class="user_avatar"
        style="
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
          background-color: black;
          aspect-ratio: 1;
          min-width: 35px;
        "
      ></div>
      <div style="display: flex; margin-bottom: -5px; flex: 1; justify-content: space-evenly">
        <div style="font-size: 16px; color: rgb(100, 100, 100) !important; white-space: nowrap !important">关注</div>
        <div
          style="
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: center;
            color: black !important;
            white-space: nowrap !important;
          "
        >
          <div>发现</div>
          <div style="width: 3rem; height: 4px; background-color: #e73f4c; border-radius: 10px"></div>
        </div>
        <div style="font-size: 16px; color: rgb(100, 100, 100) !important; white-space: nowrap !important">同城</div>
      </div>

      <div
        style="
          width: 35px;
          height: 35px;
          border-radius: 50%;
          aspect-ratio: 1;
          min-width: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="margin-top: -5px">
          <path
            d="M704.448 648.768L956.48 900.736l-55.744 55.68L648.64 704.384a393.856 393.856 0 1 1 55.808-55.68z m-82.24-26.56a315.072 315.072 0 1 0-437.76-453.248 315.072 315.072 0 0 0 437.76 453.248z"
            p-id="16026"
            fill="#303030"
          ></path>
        </svg>
      </div>
    </div>
    <div class="rednote-homepage-content">
      <div style="display: flex; flex-direction: column; width: 100%">
        <div
          v-for="value of sharedState.RedNote.post.filter((_, index) => index % 2 === 0)"
          class="rednote-homepage-post"
          @click="
            sharedState.RedNote.activePost = value.id;
            console.log(value.id);
          "
        >
          <div
            class="rednote-homepage-post-img"
            :style="`background-color:${value.imgColor};color:${value.textColor};`"
          >
            {{ value.img }}
          </div>
          <div class="rednote-homepage-post-info">
            <div class="rednote-homepage-post-title">{{ value.title }}</div>
            <div class="rednote-homepage-post-author">
              <div
                :style="`background-image: url('${value.head}');
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  background-color: black;
                  aspect-ratio: 1;
                  min-width: 25px;`"
              ></div>
              <div
                style="
                  color: rgb(100, 100, 100);
                  font-size: 14px;
                  flex: 1;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                {{ value.sender }}
              </div>
              <svg viewBox="0 0 1024 1024" width="20" height="20">
                <path
                  d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z"
                  fill="#646464"
                  p-id="4875"
                ></path>
              </svg>
              <div style="color: #646464; font-size: 12px">{{ value.like }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; width: 100%">
        <div
          v-for="value of sharedState.RedNote.post.filter((_, index) => index % 2 === 1)"
          class="rednote-homepage-post"
          @click="
            sharedState.RedNote.activePost = value.id;
            console.log(value.id);
          "
        >
          <div class="rednote-homepage-post-img" :style="`background-color:${value.imgColor}`">{{ value.img }}</div>
          <div class="rednote-homepage-post-info">
            <div class="rednote-homepage-post-title">{{ value.title }}</div>
            <div class="rednote-homepage-post-author">
              <div
                :style="`background-image: url('${value.head}');
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  background-size: cover;
                  background-position: top center;
                  background-repeat: no-repeat;
                  background-color: black;
                  aspect-ratio: 1;
                  min-width: 25px;`"
              ></div>
              <div
                style="
                  color: rgb(100, 100, 100);
                  font-size: 14px;
                  flex: 1;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                {{ value.sender }}
              </div>
              <svg viewBox="0 0 1024 1024" width="20" height="20">
                <path
                  d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z"
                  fill="#646464"
                  p-id="4875"
                ></path>
              </svg>
              <div style="color: #646464; font-size: 12px">{{ value.like }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rednote-homepage-bottom">
      <div class="rednote-homepage-bottom-button" style="color: black; font-size: 18px">首页</div>
      <div class="rednote-homepage-bottom-button">市集</div>
      <div
        @click="sharedState.phone.activeApp = 'QQ'"
        style="width: 3rem; height: 40px; background-color: #ea3e4a; border-radius: 9px; position: relative"
      >
        <div
          style="
            width: 50%;
            background-color: white;
            height: 4px;
            position: absolute;
            border-radius: 5px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        ></div>
        <div
          style="
            width: 50%;
            background-color: white;
            height: 4px;
            position: absolute;
            border-radius: 5px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
          "
        ></div>
      </div>
      <div class="rednote-homepage-bottom-button">消息</div>
      <div class="rednote-homepage-bottom-button">我的</div>
    </div>
  </div>
  <transition name="slide-fade">
    <div class="rednote-postpage-list" style="width: 100%; height: 100%" v-show="sharedState.RedNote.activePost">
      <post v-for="value of sharedState.RedNote.post" :postContent="value"></post>
    </div>
  </transition>
</template>
<script setup>
import { sharedState } from '../shared-state';
import post from './post.vue';
</script>
<style>
.rednote-postpage-bottom {
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
  padding: 0px 10px;
  border-top: 1px solid #f6f6f6;
  gap: 3px;
}
.rednote-postpage-comment {
  display: flex;
  align-items: start;
  gap: 8px;
  /* margin-bottom: 25px; */
}
.rednote-postpage-content::-webkit-scrollbar {
  display: none !important;
}
.rednote-postpage-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.rednote-postpage-top {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px 10px;
  border-bottom: 1px solid #eaedf2;
}
.rednote-postpage {
  background-color: white;
  width: 100%;
  height: 100%;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
}
.rednote-homepage-bottom-button {
  color: #939393;
  width: 3rem;
  font-size: 16px;
  text-align: center;
}
.rednote-homepage-bottom {
  width: 100%;
  height: 50px;
  /* padding-top: 5px; */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #e4e4e4;
}
.rednote-homepage-post-title {
  font-size: 16px;
  text-align: start;
  color: black !important;
}
.rednote-homepage-post-author {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}
.rednote-homepage-post-info {
  padding: 10px;
}
.post-img-blue {
  background-color: #ebe8f9;
}
.post-img-pink {
  background-color: #fbe7f0;
}
.post-img-green {
  background-color: #edefc8;
}
.post-img-purple {
  background-color: #d9c0ff;
}
.rednote-homepage-post-img {
  font-size: 20px;
  padding: 2.5rem 1.5rem;
  border-radius: 5px;
  text-align: center;
}
.rednote-homepage-post {
  width: 100%;
  margin-top: 5px;
  background-color: #ffffff;
  border-radius: 5px;
  height: fit-content;
  /* box-shadow: 2px 2px 2px rgba(15, 15, 15, 0.3); */
}
.rednote-homepage-content::-webkit-scrollbar {
  display: none !important;
}
.rednote-homepage-content {
  width: 100%;
  height: auto;
  flex: 1;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 5px;
  padding: 5px;
  overflow-y: auto;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
.rednote-homepage {
  width: 100%;
  height: 100%;
  padding-top: 35px;
  display: flex;
  flex-direction: column;
  background-color: #f8fcfd;
}
.rednote-homepage-top {
  display: flex;
  font-size: 18px;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px 10px;
  /* gap: 30px; */
  border-bottom: 1px solid #e4e4e4;
}
.rednote-homepage {
  letter-spacing: 1px;
  line-height: 1.4;
}
</style>
