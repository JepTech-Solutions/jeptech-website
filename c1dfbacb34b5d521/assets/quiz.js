/* Bicycle maintenance – quiz component.
   Markup (one per question):
     <div class="quiz" data-answer="b">
       <p class="q">Question</p>
       <button data-key="a">…</button><button data-key="b">…</button><button data-key="c">…</button>
       <p class="why">Shown after any answer.</p>
     </div>
   Optional score line anywhere on the page: <p class="quiz-score"></p>
   The first answer counts; the reader can still try the others. */
(function () {
  var quizzes = document.querySelectorAll(".quiz");
  var score = document.querySelector(".quiz-score");
  var answered = 0, right = 0;

  function update() {
    if (score) score.textContent = right + " of " + answered + " right first time (" + quizzes.length + " questions)";
  }

  quizzes.forEach(function (q) {
    var why = q.querySelector(".why");
    if (why) why.hidden = true;
    var first = true;
    q.querySelectorAll("button[data-key]").forEach(function (b) {
      b.type = "button";
      b.addEventListener("click", function () {
        var ok = b.dataset.key === q.dataset.answer;
        b.classList.add(ok ? "right" : "wrong");
        b.setAttribute("aria-label", b.textContent + (ok ? " – right" : " – not this one"));
        if (why) why.hidden = false;
        if (first) { first = false; answered++; if (ok) right++; update(); }
      });
    });
  });
  update();
})();
