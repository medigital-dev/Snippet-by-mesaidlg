const dataEvent = [
            /*
                    ['event name', 'date']
                */
            ["Mulai Pendaftaran PPDB", "2023-06-19T08:00:00"],
            ["Akhir Pendaftaran PPDB", "2023-06-21T15:30:00"],
            ["Seleksi Akhir", "2023-06-21T15:45:00"],
            ["Pengumuman PPDB", "2023-06-23T10:00:00"],
            ["Daftar Ulang", "2023-06-27T14:00:00"],
            ["Mulai Masa Pengenalan Lingkungan Sekolah", "2023-07-10T07:00:00"],
            ["Akhir Masa Pengenalan Lingkungan Sekolah", "2023-07-12T13:40:00"],
        ];

        const countDownClock = (number = 100, format = "seconds") => {
            const d = document;
            const daysElement = d.querySelector(".days");
            const hoursElement = d.querySelector(".hours");
            const minutesElement = d.querySelector(".minutes");
            const secondsElement = d.querySelector(".seconds");
            let countdown;
            convertFormat(format);

            function convertFormat(format) {
                switch (format) {
                    case "seconds":
                        return timer(number);
                    case "minutes":
                        return timer(number * 60);
                    case "hours":
                        return timer(number * 60 * 60);
                    case "days":
                        return timer(number * 60 * 60 * 24);
                }
            }

            function timer(seconds) {
                const now = Date.now();
                const then = now + seconds * 1000;

                countdown = setInterval(() => {
                    const secondsLeft = Math.round((then - Date.now()) / 1000);

                    if (secondsLeft <= 0) {
                        clearInterval(countdown);
                        return;
                    }

                    displayTimeLeft(secondsLeft);
                }, 1000);
            }

            function displayTimeLeft(seconds) {
                daysElement.textContent = Math.floor(seconds / 86400);
                hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
                minutesElement.textContent = Math.floor(
                    ((seconds % 86400) % 3600) / 60
                );
                secondsElement.textContent =
                    seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
            }
        };

        /*
            start countdown
            enter number and format
            days, hours, minutes or seconds
          */

        let i;
        var eventName = document.querySelector("#eventName");
        var today = new Date();
        for (i = 0; i < dataEvent.length; i++) {
            var target = new Date(dataEvent[i][1]);
            var diff = (target.getTime() - today.getTime()) / 1000;
            if (diff > 0) {
                countDownClock(diff, "seconds");
                eventName.innerHTML =
                    dataEvent[i][0] +
                    '<br><span class="small fs-6">(' +
                    target.getDate() +
                    "-" +
                    (target.getMonth() + 1) +
                    "-" +
                    target.getFullYear() +
                    ")</span>";
                break;
            }
        }
