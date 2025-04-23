import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const AdminAddGoal = () => {
  const [goal, setGoal] = useState("");
  const [userName, setUserName] = useState(""); // اسم المستخدم
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddGoal = async () => {
    if (!goal || !userName) {
      alert("يرجى إدخال الاسم والهدف!");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "goals"), {
        userName, // اسم المستخدم
        goal,
        progress: 0,
        createdAt: new Date(),
        completed: false,
      });
      alert("تمت إضافة الهدف بنجاح!");
      setGoal("");
      setUserName("");
      navigate("/adminGoalsPage"); // بعد الإضافة، انتقل إلى صفحة الأهداف
    } catch (error) {
      console.error("خطأ أثناء إضافة الهدف:", error);
      alert("حدث خطأ أثناء إضافة الهدف، يرجى المحاولة لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">إضافة هدف جديد</h2>
      <div className="card shadow-lg p-4">
        <div className="form-group mb-3">
          <label htmlFor="userName" className="form-label">اسم المستخدم</label>
          <input
            id="userName"
            type="text"
            className="form-control"
            placeholder="أدخل اسم المستخدم"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="goal" className="form-label">الهدف</label>
          <textarea
            id="goal"
            className="form-control"
            placeholder="أدخل الهدف"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows="4"
          />
        </div>
        <button
          className={`btn btn-success ${loading ? "disabled" : ""}`}
          onClick={handleAddGoal}
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "إضافة الهدف"}
        </button>
        <button className="btn btn-info mt-3"><Link to={"/adminGoalsPage"} className="text-decoration-none text-light">جميع الاهداف</Link></button>
      </div>
    </div>
  );
};

export default AdminAddGoal;