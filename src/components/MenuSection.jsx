import menuData from "../data/menuData";

export default function MenuSection() {
  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-title">
      <div className="section__inner">
        <header className="menu-intro">
          <div>
            <p className="eyebrow eyebrow--light">Il percorso</p>
            <h2 id="menu-title">Menù degustazione</h2>
          </div>
        </header>

        <ol className="menu-list">
          {menuData.map((course, index) => (
            <li className="menu-course" key={course.id}>
              <span className="menu-course__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <header className="menu-course__heading">
                <p className="menu-course__name">
                  <span lang="ja">{course.kanji}</span>
                  <i aria-hidden="true" />
                  {course.name}
                </p>
                <h3>{course.subtitle}</h3>
              </header>

              <div className="menu-course__content">
                {course.signature && <p className="menu-course__signature">{course.signature}</p>}
                {course.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {course.noteTitle && <p className="menu-course__note-title">{course.noteTitle}</p>}
                {course.notes?.map((note) => (
                  <p className="menu-course__oil" key={note.name}>
                    <strong>{note.name}</strong> — {note.text}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
