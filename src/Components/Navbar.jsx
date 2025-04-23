import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig"; // استيراد Firebase
import { signOut } from "firebase/auth"; // استيراد الوظيفة لتسجيل الخروج
import { doc, getDoc } from "firebase/firestore"; // لاسترجاع بيانات المستخدم من Firestore

function Navbar() {
  const [userName, setUserName] = useState(null); // لتخزين اسم المستخدم
  const navigate = useNavigate(); // لاستخدامه للتوجيه

  // التحقق من حالة المستخدم المسجل
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // جلب بيانات المستخدم من Firestore
        const getUserData = async () => {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName || "مستخدم بدون اسم");
          } else {
            setUserName(null); // في حالة عدم وجود البيانات
          }
        };
        getUserData();
      } else {
        setUserName(null);
      }
    });

    // تنظيف الـ unsubscribe عند الخروج من الـ Navbar
    return () => unsubscribe();
  }, []); // هذا التأثير سيتم تشغيله فقط عند تحميل الـ Navbar

  // وظيفة لتسجيل الخروج
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("تم تسجيل الخروج بنجاح");
        navigate("/login"); // التوجيه إلى صفحة تسجيل الدخول بعد الخروج
      })
      .catch((error) => {
        console.error("حدث خطأ أثناء تسجيل الخروج:", error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* الاسم على اليسار */}
        {userName && (
          <span className="navbar-brand me-auto d-none d-lg-block " style={{fontWeight:"bold" , fontSize:"20px"}}>Hole : {userName}</span>
        )}

        {/* زر التوجيه في الشاشات الصغيرة */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* العناصر على اليمين */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userName ? (
              <>
                {/* الاسم في الشاشات الصغيرة */}
                <li className="nav-item d-lg-none">
                  <span className="nav-link" style={{fontWeight:"bold" , fontSize:"20px"}}>Hole: {userName}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/goals" style={{fontWeight:"bold" , fontSize:"20px"}}>أهدافي</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger " onClick={handleLogout} >تسجيل الخروج</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" style={{fontWeight:"bold" , fontSize:"20px"}}>التسجيل</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">تسجيل الدخول</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;