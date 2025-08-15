"use client";

import { deleteOtEntry } from "../actions/otActions";
import DeleteBtnConfirm from "./DeleteBtnConfirm";
import DownloadPdfButton from "./DownloadPdfButton";
import { downloadOtSlip } from "@/utils/pdf-download/downloadOtSlip";
import TextLink from "./TextLink";
import formatDate from "@/utils/formatDate";
import { extractAfterH } from "@/utils/extractAfterH";

const OtView = ({ dept, data }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Overtime Slip
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 text-gray-700 mb-2">
          <div>
            <span className="font-bold text-gray-900">Date:</span>{" "}
            {formatDate(data.Date)}
          </div>
          <div>
            <span className="font-bold text-gray-900">Type:</span> {data.Type}
          </div>
          <div>
            <span className="font-bold text-gray-900">Unit:</span>{" "}
            {Array.isArray(data.Unit) ? data.Unit.join(", ") : data.Unit}
          </div>
          <div className="sm:col-span-2">
            <span className="font-bold text-gray-900">Work Description:</span>{" "}
            {data.WorkDescription}
          </div>
        </div>

        <div className="mb-3 font-bold">Employee</div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-gray-900 border-b">
                  Name
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 border-b">
                  OT Time
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 border-b">
                  OT Hour
                </th>
              </tr>
            </thead>
            <tbody>
              {data.Employee.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{emp.Name}</td>
                  <td className="px-4 py-2">{extractAfterH(emp.OtTime)}</td>
                  <td className="px-4 py-2">{emp.OtHour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.Remarks?.trim() && (
          <div className="text-gray-700 whitespace-pre-line">
            <span className="font-bold text-gray-900">Remarks:</span>{" "}
            {data.Remarks}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <DownloadPdfButton onClick={() => downloadOtSlip(data, dept)} />
        <TextLink
          isButton
          href={`/${dept}/slip/edit?id=${data._id}`}
          text={"Edit"}
        />
        <TextLink
          isButton
          href={`/${dept}/slip/copy?id=${data._id}`}
          text={"Copy"}
        />
        <DeleteBtnConfirm
          dept={dept}
          currentId={data._id}
          deleteAction={deleteOtEntry}
        />
      </div>
    </div>
  );
};

export default OtView;
