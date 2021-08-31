import axios from "axios";

const baseUrl = "https://sheets2api.aakritsubedi9.com.np/sheets2api";

class PokerService {
  static async fetchAllEvents() {
    const res = await axios.get(
      `${baseUrl}?key=1opV4Kq7oJipVL5hVmVY8ce_mJFJT4qad5cptbTti3w0&gid=0`
    );

    return res.data;
  }

  static async fetchAllServers() {
    const res = await axios.get(
      `${baseUrl}?key=1opV4Kq7oJipVL5hVmVY8ce_mJFJT4qad5cptbTti3w0&gid=489135342`
    );

    return res.data;
  }

  static async addServer(data) {
    const res = await axios.post(
      `${baseUrl}?key=1opV4Kq7oJipVL5hVmVY8ce_mJFJT4qad5cptbTti3w0&gid=489135342`,
      data
    );

    return res.data;
  }
}

export default PokerService;
