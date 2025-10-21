<template>
  <transition name="slide-fade">
    <div v-show="sharedState.RedNote.activePost == props.postContent.id" class="rednote-postpage">
      <div class="rednote-postpage-top">
        <svg @click="sharedState.RedNote.activePost = ''" viewBox="0 0 1024 1024" width="15" height="15">
          <path
            d="M771.988 947.44l-403.54-405.135c-15.95-15.95-15.95-43.065 0-60.61l406.73-406.73c17.545-15.95 19.14-43.065 3.19-60.61C770.393 4.785 759.228 0 746.468 0s-23.926 4.785-31.901 14.355l-9.57 9.57-457.77 459.365c-15.95 15.95-15.95 43.065 0 60.61l467.34 467.34c7.975 7.975 17.545 12.76 28.71 12.76 23.925 0 43.066-19.14 43.066-41.47 1.595-14.356-4.785-27.116-14.355-35.09z"
            fill="#333333"
            p-id="4540"
          ></path>
        </svg>
        <div
          :style="`background-image: url('${props.postContent.head}');
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-size: cover;
            background-position: top center;
            background-repeat: no-repeat;
            background-color: black;
            aspect-ratio: 1;
            min-width: 30px;`"
        ></div>
        <div style="font-size: 16px; color: #1d1d1d !important">{{ props.postContent.sender }}</div>
        <div style="margin-left: auto; display: flex; align-items: center; gap: 10px">
          <div
            style="
              margin-left: auto;
              border-radius: 150px;
              border: 1px solid #c8b9bc;
              color: #ce3d4a;
              padding: 2px 20px;
              font-size: 14px;
            "
          >
            关注
          </div>
          <svg viewBox="0 0 1252 1024" width="22" height="22">
            <path
              d="M789.325694 92.701516L1164.112805 483.412814c19.905234 20.758315 24.739362 31.279653-2.559244 59.715701L788.472612 936.114697V767.773294a71.09012 71.09012 0 0 0-71.09012-71.09012h-39.810467c-125.971692 0-424.550195 23.88628-597.157006 210.711115 32.132734-183.412509 120.568843-351.185192 252.512106-457.251651a615.640437 615.640437 0 0 1 356.019319-126.824773l32.417095-1.706163a71.09012 71.09012 0 0 0 67.109073-71.37448V92.701516M773.970228 0c-28.436048 0-56.872096 22.748838-56.872096 69.952678V250.237222l-32.132734 1.706162a682.46515 682.46515 0 0 0-398.104671 142.18024C142.689964 511.848862 27.239609 708.626314 0.509724 961.991501A54.881572 54.881572 0 0 0 46.860483 1023.697725a22.748838 22.748838 0 0 0 7.393372 0 48.056921 48.056921 0 0 0 43.507153-25.308083C236.244562 799.337307 532.26382 767.773294 677.572025 767.773294h39.810467v193.080765A59.715701 59.715701 0 0 0 776.529472 1023.697725a65.11855 65.11855 0 0 0 46.350758-20.758315l389.858217-412.038334c50.047444-52.037968 52.606689-106.066459 2.559244-158.104427L815.202497 17.91471A56.872096 56.872096 0 0 0 773.970228 0z"
              p-id="7405"
              fill="#333333"
            ></path>
          </svg>
        </div>
      </div>
      <div class="rednote-postpage-content">
        <div
          class="rednote-homepage-post-img"
          :style="`padding: 5rem 3rem;background-color:${props.postContent.imgColor};color:${props.postContent.textColor};`"
        >
          {{ props.postContent.img }}
        </div>
        <div style="padding: 20px 8px 15px; width: 100%">
          <div class="rednote-postpage-posttitle" style="font-size: 18px; color: #1d1d1d !important">
            {{ props.postContent.title }}
          </div>
          <div
            style="
              font-size: 15px;
              margin-top: 10px;
              color: #1d1d1d !important;
              letter-spacing: 1.5px;
              line-height: 1.6;
            "
            v-html="warpHandle(props.postContent.content)"
          ></div>
          <div style="margin-top: 10px; color: #8c8c8c !important; font-size: 12px">{{ props.postContent.time }}</div>
          <div style="width: 100%; height: 1px; background-color: #f7f7f7; margin-top: 15px; margin-bottom: 20px"></div>
          <div style="display: flex; flex-direction: column; gap: 25px; width: 100%">
            <div v-for="comment of props.postContent.comments || []" class="rednote-postpage-comment">
              <div
                :style="`background-image: url('${comment.head}');
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-size: cover;
                background-position: center top;
                background-repeat: no-repeat;
                background-color: black;
                aspect-ratio: 1 / 1;
                min-width: 30px;`"
              ></div>
              <div style="margin-top: -4px; width: 100%">
                <div style="color: #919191; text-overflow: ellipsis; overflow: hidden; flex: 1; font-size: 13px">
                  {{ comment.sender }}
                </div>
                <div style="margin-top: 5px; color: #1d1d1d !important; font-size: 14px">{{ comment.content }}</div>
                <div style="display: flex; align-items: center; margin-top: 5px">
                  <div style="color: #8c8c8c; font-size: 12px">{{ comment?.time || '未知时间' }}</div>
                  <div style="color: #636363; margin-left: 5px; font-size: 13px">回复</div>
                  <svg style="margin-left: auto" viewBox="0 0 1024 1024" width="20" height="20">
                    <path
                      d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z"
                      fill="#646464"
                      p-id="4875"
                    ></path>
                  </svg>
                  <div style="color: #6a6a6a; margin-left: 5px; font-size: 13px">{{ comment.like }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rednote-postpage-bottom">
        <div style="flex: 1">
          <input
            @keyup.enter="sendComment"
            v-model="input_value"
            type="text"
            placeholder="说点什么..."
            style="
              width: 100% !important;
              background-color: #f5f5f5 !important;
              border-radius: 30px !important;
              padding: 5px 10px !important;
              border: none !important;
              font-size: 13px !important;
              color: black !important;
            "
          />
        </div>
        <div style="display: flex; align-items: center; gap: 5px">
          <svg viewBox="0 0 1024 1024" width="22" height="22">
            <path
              d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z"
              fill="#393939"
              p-id="4875"
            ></path>
          </svg>
          <div
            style="
              white-space: nowrap;
              max-width: 2.5rem;
              color: #393939;
              text-overflow: clip;
              overflow: hidden;
              font-size: 12px;
            "
          >
            {{ props.postContent.like }}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 5px">
          <svg viewBox="0 0 1025 1024" width="20" height="20">
            <path
              d="M512.118374 131.072L603.766374 317.44c20.48 41.472 59.392 70.144 104.96 76.8l205.824 30.208-148.992 145.92c-32.768 32.256-47.616 78.336-39.936 123.392l35.328 205.824-183.296-96.768c-19.968-10.752-42.496-16.384-65.024-16.384-22.528 0-45.056 5.632-65.024 16.384l-183.296 96.768 35.328-205.824c7.68-45.056-7.168-91.136-39.936-123.392L109.686374 424.448 314.998374 394.24c45.568-6.656 84.992-35.328 104.96-76.8l92.16-186.368m0-112.64c-20.48 0-41.472 10.752-51.712 32.256L346.742374 281.6c-8.192 16.896-24.576 29.184-43.52 31.744L49.270374 350.208C2.166374 357.376-16.777626 415.232 17.526374 449.024l183.808 180.224c13.312 13.312 19.968 32.256 16.384 51.2l-43.52 253.952c-6.144 37.376 23.552 67.584 56.832 67.584 8.704 0 17.92-2.048 27.136-6.656L484.982374 875.52c8.192-4.608 17.92-6.656 27.136-6.656 9.216 0 18.432 2.048 27.136 6.656l226.816 119.808c8.704 4.608 17.92 6.656 27.136 6.656 33.792 0 63.488-30.208 56.832-67.584l-43.52-253.952c-3.072-18.944 3.072-37.888 16.384-51.2l183.808-180.224c34.304-33.28 15.36-91.648-32.256-98.304l-253.952-36.864c-18.944-2.56-35.328-14.848-43.52-31.744L563.830374 50.688c-10.752-21.504-31.232-32.256-51.712-32.256z"
              p-id="8508"
              fill="#393939"
            ></path>
          </svg>
          <div
            style="
              white-space: nowrap;
              max-width: 2.5rem;
              color: #393939;
              text-overflow: clip;
              overflow: hidden;
              font-size: 12px;
            "
          >
            {{ props.postContent.star }}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 5px">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M405.97 530.4m-40.81 0a40.81 40.81 0 1 0 81.62 0 40.81 40.81 0 1 0-81.62 0Z" p-id="10557"></path>
            <path d="M618.04 530.4m-40.81 0a40.81 40.81 0 1 0 81.62 0 40.81 40.81 0 1 0-81.62 0Z" p-id="10558"></path>
            <path
              d="M512.01 959.33c-70.48 0-140.41-16.79-202.89-48.62H93.23V669.25c-18.96-50.4-28.56-103.26-28.56-157.26 0-246.66 200.68-447.32 447.34-447.32s447.32 200.66 447.32 447.32-200.66 447.34-447.32 447.34zM166.85 837.09h160.56l8.16 4.39c53.89 28.94 114.89 44.23 176.43 44.23 206.06 0 373.7-167.65 373.7-373.72 0-206.06-167.65-373.7-373.7-373.7-206.07 0-373.72 167.65-373.72 373.7 0 47.09 8.75 93.16 25.99 136.91l2.57 6.51v181.68z"
              p-id="10559"
            ></path>
          </svg>
          <div
            style="
              white-space: nowrap;
              max-width: 2.5rem;
              color: #393939;
              text-overflow: clip;
              overflow: hidden;
              font-size: 12px;
            "
          >
            {{ props.postContent.comment }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { sharedState } from '../shared-state';
const props = defineProps(['postContent']);
const input_value = ref('');
function warpHandle(content) {
  if (!content) {
    return '';
  }
  content = content.replace(/\\n/g, '<br>');
  content = content.replace(/\[(img|vedio|bqb)/g, `<br>[$1`);
  return content;
}

function sendComment() {
  if (sharedState.generate || !input_value.value.match(/\S/)) {
    return;
  }

  let message = sharedState.QQ.cacheMsg.join('\n').trim();
  message += `\n在${props.postContent.sender}发的小红书帖子${props.postContent.id}中评论:${input_value.value}`;

  if (sharedState.phone.sendModel == '尾附') {
    const old_content = $('#send_textarea').val().trim();
    const new_content = old_content + message;
    $('#send_textarea')
      .val(new_content.trim() || '')[0]
      .dispatchEvent(new Event('input', { bubbles: true }));
    input_value.value = '';
    sharedState.QQ.cacheMsg = [];
    return;
  }

  triggerSlash(`/send ${message.trim()}|/trigger`);

  input_value.value = '';
  sharedState.QQ.cacheMsg = [];
}
</script>
