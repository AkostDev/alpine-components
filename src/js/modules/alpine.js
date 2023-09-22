import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

Alpine.plugin(intersect);

import Swiper from 'swiper';
import { Thumbs, Mousewheel, FreeMode } from 'swiper/modules';
import 'swiper/css';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('tabs', () => ({
        init() {
            new Swiper(this.$refs.contents, {
                allowTouchMove: false,
                autoHeight: true,
                speed: 0,
                modules: [Thumbs],
                thumbs: {
                    swiper: new Swiper(this.$refs.tabs, {
                        slidesPerView: 'auto',
                        modules: [Mousewheel, FreeMode],
                        mousewheel: {
                            forceToAxis: true
                        },
                        freeMode: true,
                        watchSlidesProgress: true,
                        slideToClickedSlide: true,
                    })
                }
            });
        }
    }));

    Alpine.data('lazyLoading', (url, type = 'html', data = {}) => ({
        requestUrl: url,
        dataType: type,
        requestData: data,
        response: null,

        content: {
            ['x-intersect.once']() {
                this.request();
            },
            ['x-html']() {
                return this.response || '&nbsp;';
            }
        },

        async request() {
            this.requestData.from_local = 'Y';

            let request = await fetch(this.requestUrl, {
                method: 'POST',
                body: JSON.stringify(this.requestData)
            });

            if (this.dataType === 'html') {
                this.response = await request.text();
            }

            if (this.dataType === 'json') {
                this.response = await request.json();
            }
        }
    }));
});

Alpine.start();