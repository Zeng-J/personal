var app = new Vue({
    el: '#app',
    data: {
        dataSource: IMG_URL.map((i, k) => ({
            key: i,
            img: './static/images/'+i,
        })),
        initalAxis: {},
    },
    mounted() {
        setTimeout(() => {
            this.dataSource = JSON.parse(JSON.stringify(this.dataSource)).map(item => {
                let innerWidth = window.innerWidth,
                innerHeight = window.innerHeight;
    
                // 减去200，是为了让照片不要定位在窗口外(粗略计算)
                let x = Math.floor(Math.random()*(innerWidth-200)),
                    y = Math.floor(Math.random()*(innerHeight-200));

                Object.assign(item, {
                    x,
                    y,
                    style: {
                        left: x + 'px',
                        top: y + 'px',
                    }
                });
                return item;
            })
        }, 1000)
    },
    methods: {

        handleTouchstart(event) {
            // currentTarget绑定该事件的元素，target触发元素
            // console.log(event, event.target, event.currentTarget);

            let clientX = event.touches ? event.touches[0].clientX : event.clientX, 
                clientY = event.touches ? event.touches[0].clientY : event.clientY; 

            this.initalAxis = {
                diffX: clientX - Number(event.currentTarget.style.left.slice(0, -2)),
                diffY: clientY - Number(event.currentTarget.style.top.slice(0, -2)),
            };

        },
        handleTouchend(event, key) {
            // console.log('touchend', event)
            this.handleDragmove(event, key);
        },

        handleMousemove(event) {
            this.handleHover(event);
        },
        handleHover(event) {

            let currentX = event.x,
                currentY = event.y;

            this.dataSource = JSON.parse(JSON.stringify(this.dataSource)).map(item => {

                let xDeg = Math.floor((item.x + 100 - currentX)/window.innerWidth*90),
                    yDeg = Math.floor((item.y + 100 - currentY)/window.innerHeight*90);

                item.style = {
                    ...item.style,
                    transform: `rotateX(${yDeg}deg) rotateY(${xDeg}deg)`,
                };
                return item;
            })
        },


        onDragstart(event) {
            // console.log('start', event, event.target);

            let clientX = event.touches ? event.touches[0].clientX : event.clientX, 
            clientY = event.touches ? event.touches[0].clientY : event.clientY; 

            this.initalAxis = {
                diffX: clientX - Number(event.currentTarget.style.left.slice(0, -2)),
                diffY: clientY - Number(event.currentTarget.style.top.slice(0, -2)),
            };

            event.dataTransfer.effectAllowed = 'move';
        },
        onDragend(event, key) {
            this.handleDragmove(event, key);
        },

        handleDragmove(event, key) {
            let clientX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX, 
            clientY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY; 
            
            let x = clientX - this.initalAxis.diffX,
            y = clientY - this.initalAxis.diffY;

            let list = JSON.parse(JSON.stringify(this.dataSource));
            let findObj = list.find(item => item.key == key);
            Object.assign(findObj, {
                x,
                y,
                style: {
                    left: x + 'px',
                    top: y + 'px',
                }
            });

            this.dataSource = list;
        },

        handLoadImage(e, data) {
            // console.log(e, data.img);
            let list = JSON.parse(JSON.stringify(this.dataSource));
            let findObj = list.find(item => item.key == data.key);

            findObj.isComplete = true;

            this.dataSource = list;
        }
    },
})