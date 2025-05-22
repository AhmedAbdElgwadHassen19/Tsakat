import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminAddGoal from "./AdminAddGoal";
import { onAuthStateChanged } from "firebase/auth"; // استيراد onAuthStateChanged
import Navbar from "./Navbar";
const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // مراقبة حالة المستخدم باستخدام onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // إذا لم يكن المستخدم مسجلاً دخوله، يتم توجيهه إلى صفحة تسجيل الدخول
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          setError("المستخدم غير موجود في قاعدة البيانات!");
          return;
        }

        const userData = userDoc.data();

        if (userData.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/goals");
        }
      } catch (err) {
        console.error("Error during authentication check:", err);
        setError("حدث خطأ أثناء التحقق من الصلاحيات.");
      } finally {
        setLoading(false);
      }
    });

    // تنظيف الـ observer عند إلغاء التثبيت
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">جاري التحقق...</span>
        </div>
        <h2 className="ms-3">جاري التحقق من صلاحياتك...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h2>🚫 عذرًا، لا يمكنك الوصول إلى هذه الصفحة</h2>
        <p>تحتاج إلى أن تكون مشرفًا للوصول إلى هذه الصفحة. قم بتسجيل الدخول باستخدام حساب المشرف.</p>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          الذهاب إلى تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container-fluid p-5 bg-dark" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-md-8 col-lg-12 bg-dark">
          <nav>
            <ol className="list-unstyled">
              <li className="fw-bold text-center text-light">لوحة تحكم الأدمن</li>
            </ol>
          </nav>
          <h3 className="text-primary text-center">📌 لوحة تحكم الأدمن - إضافة الأهداف</h3>
          <AdminAddGoal />
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminPage;