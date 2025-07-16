import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const getMovieSuggestions = async (currentMovie, refreshIndex = 0) => {
  try {
    console.log(" Gợi ý lại lần:", refreshIndex);
    const categoryList = currentMovie.category || [];
const genreSlug = categoryList.length > 0
  ? categoryList[Math.floor(Math.random() * categoryList.length)]?.slug
  : null;

    console.log(" Thể loại chính:", genreSlug);

    const res = await axios.get(
      `https://phimapi.com/v1/api/the-loai/${genreSlug}?page=1&limit=15`
    );

    let movieList = res.data.data.items || [];

    const compactMovieList = movieList
      .map(({ name, origin_name, slug, thumb_url, content }) => {
        const validThumb = thumb_url?.startsWith("http")
          ? thumb_url
          : `https://phimimg.com/${thumb_url}`;
        return {
          name,
          origin_name,
          slug,
          thumb_url: validThumb,
          content: content || "",
        };
      })
      .filter(movie => movie.thumb_url.startsWith("http"));

    console.log("🎬 Danh sách phim hợp lệ gửi Gemini:", compactMovieList);

    const listString = JSON.stringify(compactMovieList, null, 2);

    const prompt = `
Phim đang xem:
Tên: ${currentMovie.name}
Thể loại: ${categoryList.map(c => c.name).join(", ")}
Mô tả: ${currentMovie.content}
Lần gợi ý: ${refreshIndex}

Bạn hãy chọn cho người dùng 7 phim trong danh sách sau : ${listString}

Yêu cầu:
- Nếu đây là lần gợi ý lại (refreshIndex > 0), bạn bắt buộc phải thay đổi ít nhất 5 phim so với danh sách đã chọn trước đó.
- Bạn KHÔNG thể chỉ đổi chỗ 6 bộ phim – bắt buộc phải chọn ít nhất 5 phim mới.
- Chỉ được chọn đúng 7 phim từ danh sách trên (KHÔNG được tự bịa hoặc thêm mới).
- KHÔNG được đổi hoặc tạo mới link ảnh thumb_url.
- Trả kết quả duy nhất dưới dạng JSON hợp lệ (bắt đầu bằng [ và kết thúc bằng ]).
- KHÔNG thêm giải thích hoặc văn bản bên ngoài JSON.
- Mỗi phần tử gồm các trường sau:
  - name: Tên phim
  - slug: slug phim
  - origin_name: Tên gốc
  - thumb_url: Đường dẫn ảnh minh họa
  - ly_do: Gồm 2 phần:
    + Tóm tắt nội dung ngắn gọn của phim (1–2 câu).
    + Giải thích vì sao phim này được chọn, dựa trên sự tương đồng với phim đang xem (về thể loại, chủ đề, cảm xúc, nhân vật, bối cảnh...).
`.trim();


    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log(" Kết quả text từ Gemini:\n", text);

    const matches = text.match(/\[\s*{[\s\S]*?}\s*]/);
    if (!matches) throw new Error(" Không tìm thấy JSON hợp lệ trong phản hồi Gemini.");

    const parsed = JSON.parse(matches[0]);
    console.log(" JSON parse thành công:\n", parsed);

    const validThumbs = new Set(compactMovieList.map(m => m.thumb_url));
    const safeParsed = parsed
      .filter(p => validThumbs.has(p.thumb_url))
      .map(p => ({
        name: p.name || "Không rõ",
        slug: p.slug || "",
        origin_name: p.origin_name || "",
        thumb_url: p.thumb_url,
        ly_do: p.ly_do || "Phim có nội dung tương tự."
      }));

    console.log(" Kết quả sau lọc hợp lệ:\n", safeParsed);

    return safeParsed;
  } catch (err) {
    console.error(" Lỗi gọi getMovieSuggestions:", err);
    return [];
  }
};
