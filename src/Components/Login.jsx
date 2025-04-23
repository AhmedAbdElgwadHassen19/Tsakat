// Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate , Link} from "react-router-dom";
import '../Styles/Login+Sigup.css';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // لتخزين الأخطاء
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // محاولة تسجيل الدخول
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // جلب بيانات المستخدم من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        setError("المستخدم غير موجود في قاعدة البيانات!");
        return;
      }

      // التحقق من الدور "admin"
      const userData = userDoc.data();
      if (userData.role === "admin") {
        navigate("/admin");  // توجيه إلى صفحة الأدمن
      } else {
        navigate("/goals");  // توجيه إلى صفحة الأهداف للمستخدمين العاديين
      }
  
    } catch (error) {
      setError("خطأ أثناء تسجيل الدخول: " + error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">تسجيل الدخول</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link to={"/signup"} className="text-decoration-none"><p className="text-info text-center">انشاء حساب  جديد</p></Link>
            <button type="submit" className="btn btn-primary w-100">دخول</button>
          </form>
          
          {error && <div className="alert alert-danger mt-3">{error}</div>}  {/* عرض الخطأ إذا كان موجود */}
        </div>
      </div>
    </div>
  );
}

export default Login;
